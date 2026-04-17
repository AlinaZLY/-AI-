/**
 * 转义 SQL LIKE 模式中的特殊字符（%, _, \），防止通配符注入。
 * TypeORM 会对值本身进行参数化绑定（防 SQL 注入），但不会阻止
 * `%` 和 `_` 作为通配符匹配非预期数据，此函数补充该防护。
 */
export function escapeLike(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_');
}
