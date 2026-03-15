#!/usr/bin/env python3
"""
Rebuild linear git history: root commit uses BASE commit's tree; subsequent commits
apply batches of file updates until HEAD tree matches FINAL_REF, using messages
and author dates from GIT_RESTRUCTURE_PLAN.md.

Run from repo root:
  py -3 scripts/rebuild_git_history.py

Env (optional):
  REBUILD_BASE, REBUILD_FINAL (default HEAD), REBUILD_BRANCH, REBUILD_TMP_BRANCH,
  REBUILD_BACKUP_BRANCH
"""
from __future__ import annotations

import os
import re
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path


@dataclass
class PlanEntry:
    month: int
    day: int
    time_hm: str
    author_cn: str
    message: str

    def git_date(self, year: int = 2026) -> str:
        hh, mm = self.time_hm.split(":")
        return f"{year}-{self.month:02d}-{self.day:02d} {int(hh):02d}:{int(mm):02d}:00 +0800"


# Chinese keys as escapes so the file stays valid UTF-8 on all Windows editors.
AUTHORS = {
    "\u738b\u4fca\u7fd4": ("TJbubble", "205479911+TJbubble@users.noreply.github.com"),
    "\u738b\u601d\u8fdc": ("siyuanWang348", "201439910+siyuanWang348@users.noreply.github.com"),
    "\u5f20\u5cfb\u5c79": ("JunyiZ-hub", "2774703240@qq.com"),
    "\u5f20\u529b\u5c39": ("AlinaZLY", "150918745+AlinaZLY@users.noreply.github.com"),
}


def repo_root() -> Path:
    """Resolve repo via git so Chinese paths survive Windows/Python cwd quirks."""
    envp = os.environ.get("REBUILD_REPO")
    if envp and Path(envp, ".git").exists():
        return Path(envp).resolve()
    try:
        out = subprocess.check_output(
            ["git", "rev-parse", "--show-toplevel"],
            cwd=os.getcwd(),
            text=True,
            encoding="utf-8",
            errors="strict",
        )
        return Path(out.strip()).resolve()
    except Exception:
        here = Path(__file__).resolve().parent.parent
        if (here / ".git").exists():
            return here
    raise SystemExit("Run this script from the repository root (directory containing .git).")


def run_git(repo: Path, *args: str, check: bool = True) -> str:
    r = subprocess.run(
        ["git", *args],
        cwd=str(repo),
        check=check,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    return r.stdout.strip()


def norm_git_path(path: str) -> str:
    return path.replace("\\", "/")


def commit_env(entry: PlanEntry) -> dict[str, str]:
    name, email = AUTHORS[entry.author_cn]
    date = entry.git_date()
    env = os.environ.copy()
    env["GIT_AUTHOR_NAME"] = name
    env["GIT_AUTHOR_EMAIL"] = email
    env["GIT_AUTHOR_DATE"] = date
    env["GIT_COMMITTER_NAME"] = name
    env["GIT_COMMITTER_EMAIL"] = email
    env["GIT_COMMITTER_DATE"] = date
    return env


def parse_plan(plan_path: Path) -> list[PlanEntry]:
    text = plan_path.read_text(encoding="utf-8")
    entries: list[PlanEntry] = []
    cur_day: tuple[int, int] | None = None
    for line in text.splitlines():
        m = re.match(r"####\s+(\d+)/(\d+)", line)
        if m:
            cur_day = (int(m.group(1)), int(m.group(2)))
            continue
        if not cur_day or "|" not in line:
            continue
        parts = [p.strip() for p in line.split("|")]
        if len(parts) < 5:
            continue
        t = parts[1]
        if not re.match(r"\d{2}:\d{2}$", t):
            continue
        author = parts[2]
        if author not in AUTHORS:
            continue
        msg_m = re.search(r"`([^`]+)`", line)
        if not msg_m:
            continue
        mo, d = cur_day
        entries.append(PlanEntry(mo, d, t, author, msg_m.group(1).strip()))
    return entries


def ref_exists(repo: Path, ref: str) -> bool:
    r = subprocess.run(
        ["git", "show-ref", "--verify", "--quiet", ref],
        cwd=str(repo),
        capture_output=True,
    )
    return r.returncode == 0


def main() -> int:
    repo = repo_root()
    os.chdir(repo)
    plan_path = repo / "GIT_RESTRUCTURE_PLAN.md"
    base = os.environ.get("REBUILD_BASE", "3d7b1b4fcb04a8a5214d8555dbe1a3a64d775697")
    final_ref = os.environ.get("REBUILD_FINAL", "HEAD")
    target_branch = os.environ.get("REBUILD_BRANCH", "feature/junxiang-community-user")
    tmp_branch = os.environ.get("REBUILD_TMP_BRANCH", "history-rebuild-tmp")
    backup_branch = os.environ.get("REBUILD_BACKUP_BRANCH", "backup/pre-120-rebuild")

    if not plan_path.is_file():
        print("Missing GIT_RESTRUCTURE_PLAN.md", file=sys.stderr)
        return 2

    entries = parse_plan(plan_path)
    if len(entries) < 100:
        print(f"Too few plan entries: {len(entries)}", file=sys.stderr)
        return 2

    st = run_git(repo, "status", "--porcelain")
    if st:
        print("Working tree not clean. Commit or stash first.", file=sys.stderr)
        print(st, file=sys.stderr)
        return 2

    run_git(repo, "config", "core.quotepath", "false")

    final_commit = run_git(repo, "rev-parse", final_ref)
    final_tree = run_git(repo, "rev-parse", f"{final_commit}^{{tree}}")
    base_commit = run_git(repo, "rev-parse", base)
    base_tree = run_git(repo, "rev-parse", f"{base_commit}^{{tree}}")

    if final_tree == base_tree:
        print("FINAL tree equals BASE tree; nothing to rebuild.", file=sys.stderr)
        return 2

    def ls_tree_names(treeish: str) -> set[str]:
        r = subprocess.run(
            ["git", "ls-tree", "-r", "-z", "--name-only", treeish],
            cwd=str(repo),
            capture_output=True,
            check=True,
        )
        parts = r.stdout.split(b"\0")
        names = [p.decode("utf-8", errors="surrogateescape") for p in parts if p]
        return set(names)

    final_files = ls_tree_names(final_tree)
    base_files = ls_tree_names(base_tree)
    to_delete = sorted(base_files - final_files)
    to_sync = sorted(final_files)

    ops: list[tuple[str, str]] = []
    for p in to_sync:
        ops.append(("sync", p))
    for p in to_delete:
        ops.append(("del", p))

    n_body = max(1, len(entries) - 1)
    if len(ops) < n_body:
        pad = n_body - len(ops)
        filler = to_sync[-1] if to_sync else None
        if filler is None and not to_delete:
            print("No file ops to distribute", file=sys.stderr)
            return 2
        for _ in range(pad):
            ops.append(("noop", filler or to_delete[-1]))

    batches: list[list[tuple[str, str]]] = [[] for _ in range(n_body)]
    for i, op in enumerate(ops):
        batches[i % n_body].append(op)

    try:
        tip = run_git(repo, "rev-parse", target_branch)
        run_git(repo, "branch", "-f", backup_branch, tip)
        print(f"Saved previous tip to {backup_branch} ({tip[:7]})")
    except subprocess.CalledProcessError:
        print("Could not backup target branch (missing?)", file=sys.stderr)

    if ref_exists(repo, f"refs/heads/{tmp_branch}"):
        if ref_exists(repo, f"refs/heads/{target_branch}"):
            run_git(repo, "checkout", target_branch)
        else:
            run_git(repo, "checkout", "--detach", final_commit)
        run_git(repo, "branch", "-D", tmp_branch)

    run_git(repo, "checkout", "--orphan", tmp_branch)
    run_git(repo, "reset", "--hard")
    run_git(repo, "read-tree", base_tree)
    run_git(repo, "checkout-index", "-a", "-f", "-u")

    def commit_entry(entry: PlanEntry, allow_empty: bool = False) -> None:
        args = ["git", "commit", "-m", entry.message]
        if allow_empty:
            args.insert(1, "--allow-empty")
        subprocess.run(
            args,
            cwd=str(repo),
            check=True,
            env=commit_env(entry),
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
        )

    # Index already matches base_tree; avoid `git add -A` picking local node_modules etc.
    commit_entry(entries[0])

    for idx, batch in enumerate(batches, start=1):
        entry = entries[idx] if idx < len(entries) else entries[-1]
        to_stage: list[str] = []
        for kind, path in batch:
            if kind == "noop":
                continue
            p = norm_git_path(path)
            if kind == "del":
                subprocess.run(
                    ["git", "rm", "-f", "--ignore-unmatch", "--", p],
                    cwd=str(repo),
                    check=False,
                    capture_output=True,
                )
                to_stage.append(p)
            else:
                subprocess.run(
                    [
                        "git",
                        "restore",
                        "--source",
                        final_commit,
                        "--worktree",
                        "--staged",
                        "--",
                        p,
                    ],
                    cwd=str(repo),
                    check=True,
                    capture_output=True,
                    text=True,
                    encoding="utf-8",
                    errors="replace",
                )
                to_stage.append(p)
        if to_stage:
            subprocess.run(
                ["git", "add", "--", *to_stage],
                cwd=str(repo),
                check=True,
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
            )
        por = run_git(repo, "status", "--porcelain")
        if not por:
            commit_entry(entry, allow_empty=True)
        else:
            commit_entry(entry, allow_empty=False)

    new_tree = run_git(repo, "rev-parse", "HEAD^{tree}")
    if new_tree != final_tree:
        print(
            f"Tree mismatch after rebuild.\nExpected {final_tree}\nGot      {new_tree}",
            file=sys.stderr,
        )
        return 3

    if ref_exists(repo, f"refs/heads/{target_branch}"):
        subprocess.run(
            ["git", "branch", "-D", target_branch],
            cwd=str(repo),
            check=False,
            capture_output=True,
        )
    run_git(repo, "branch", "-m", target_branch)
    print(f"Done. {len(entries)} commits on {target_branch}. Backup: {backup_branch}.")
    print(run_git(repo, "rev-list", "--count", "HEAD"), "commits total")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
