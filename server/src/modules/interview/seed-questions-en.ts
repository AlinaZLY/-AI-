import { QuestionDifficulty, QuestionSource, QuestionType } from './entities/question-bank.entity';

export interface SeedQuestion {
  question: string;
  referenceAnswer: string;
  categoryName: string;
  difficulty: QuestionDifficulty;
  questionType?: QuestionType;
  options?: { label: string; value: string; isCorrect?: boolean }[];
  company?: string;
  tags: string[];
}

export const seedQuestions: SeedQuestion[] = [
  // ==================== P&G Eight Questions ====================
  { question: 'Give an example of leading a team to complete a task', referenceAnswer: 'Use the STAR method: describe team size, decisions as leader, task delegation, difficulties, solutions, and outcomes. Highlight leadership and decision-making.', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, company: 'P&G', tags: ['Leadership', 'P&G'] },
  { question: 'Give an example of persuading someone', referenceAnswer: 'Clarify the context and disagreement, describe strategies used (data, empathy, interest analysis), and the outcome after convincing the other party.', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, company: 'P&G', tags: ['Communication', 'P&G'] },
  { question: 'Give an example of changing a process or method', referenceAnswer: 'Describe problem discovery, proposed improvement, resistance during implementation, and final quantified impact.', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, company: 'P&G', tags: ['Innovation', 'P&G'] },
  { question: 'Give an example of handling a difficulty or challenge', referenceAnswer: 'Describe the difficulty, your analysis and coping strategy, lessons learned, and how you overcame it.', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, company: 'P&G', tags: ['Resilience', 'P&G'] },
  { question: 'Give an example of analyzing a complex problem and making a decision', referenceAnswer: 'Describe complexity (multiple factors, incomplete info), analytical framework (priority matrix, SWOT), and the final decision with rationale.', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.HARD, company: 'P&G', tags: ['Analytical Skills', 'P&G'] },
  { question: 'Give an example of collaborating with others to complete a task', referenceAnswer: 'Describe team composition, your role, how you coordinated differing opinions, and how you ensured efficient operation.', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.EASY, company: 'P&G', tags: ['Teamwork', 'P&G'] },
  { question: 'Give an example of setting a goal and achieving it', referenceAnswer: 'Describe the goal, why you set it, plan and execution steps, mid-course adjustments, and final achievement.', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.EASY, company: 'P&G', tags: ['Goal-Oriented', 'P&G'] },
  { question: 'Give an example of identifying risk and mitigating it proactively', referenceAnswer: 'Describe risk identification process, early warning measures, team response, and whether the issue was prevented.', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.HARD, company: 'P&G', tags: ['Risk Management', 'P&G'] },
  { question: 'Give an example of voluntarily taking on extra responsibility', referenceAnswer: 'Explain motivation, what you took on, challenges faced, and benefits to yourself and the team.', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, company: 'P&G', tags: ['Ownership', 'P&G'] },
  { question: 'Give an example of cross-departmental collaboration', referenceAnswer: 'Describe context, differing departmental demands, your coordination approach, and the consensus and results.', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.HARD, company: 'P&G', tags: ['Collaboration', 'P&G'] },
  { question: 'Give an example of using data to drive a decision', referenceAnswer: 'Describe data collection, analysis, insights derived, decision made, and outcome verification.', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, company: 'P&G', tags: ['Data-Driven', 'P&G'] },
  { question: 'Give an example of handling interpersonal conflict', referenceAnswer: 'Describe both parties, the disagreement, your mediation strategy, finding common ground, and resolution.', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.HARD, company: 'P&G', tags: ['Conflict Resolution', 'P&G'] },
  { question: 'Give an example of accepting criticism and improving', referenceAnswer: 'Describe the criticism, your reaction, improvement measures, and short-term results.', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, company: 'P&G', tags: ['Feedback', 'P&G'] },
  { question: 'Give an example of persisting through obstacles', referenceAnswer: 'Describe the goal, obstacles encountered, your persistence and adjustments, and final achievement.', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, company: 'P&G', tags: ['Persistence', 'P&G'] },
  { question: 'Give an example of helping a team member improve', referenceAnswer: 'Describe who you helped, the goal, your approach (training/coaching/sharing), and the result.', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, company: 'P&G', tags: ['Mentoring', 'P&G'] },
  { question: 'Give an example of breaking conventional thinking to solve a problem', referenceAnswer: 'Describe limitations of the conventional approach, your innovative angle, feasibility validation, and outcome.', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.HARD, company: 'P&G', tags: ['Innovation', 'P&G'] },
  { question: 'Give an example of building a capability from scratch', referenceAnswer: 'Describe the starting point, learning methods, bottlenecks, breakthroughs, and final proficiency level.', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, company: 'P&G', tags: ['Self-Motivation', 'P&G'] },
  { question: 'Give an example of influencing someone else\'s decision', referenceAnswer: 'Describe the target, desired change, influence strategies, their response, and final effect.', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.HARD, company: 'P&G', tags: ['Influence', 'P&G'] },
  { question: 'Give an example of training or mentoring others', referenceAnswer: 'Describe who you trained, the content, methods, and results. Show knowledge transfer ability.', categoryName: '宝洁八大问', difficulty: QuestionDifficulty.MEDIUM, company: 'P&G', tags: ['Mentoring', 'P&G'] },

  // ==================== Self Introduction ====================
  { question: 'Describe yourself in three words', referenceAnswer: 'Choose traits relevant to the position, support each with a brief example.', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, tags: ['Self-Awareness', 'General'] },
  { question: 'What are your greatest strengths and weaknesses?', referenceAnswer: 'Strengths should match job requirements with examples; weaknesses should be genuine but not critical, with improvement plans.', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, tags: ['Self-Awareness', 'General'] },
  { question: 'Why did you choose our company?', referenceAnswer: 'Answer from perspectives like industry outlook, company culture, business direction, and tech stack. Show you have done your research.', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, tags: ['Job Motivation', 'General'] },
  { question: 'Why did you choose this position?', referenceAnswer: 'Combine your professional background, interests, abilities, and the job description. Highlight experience-position match.', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, tags: ['Job Motivation', 'General'] },
  { question: 'Please give a 1-minute self-introduction', referenceAnswer: 'Structure: basic info + key experiences + why you fit this role. Highlight points matching the position.', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, tags: ['Self Introduction', 'General'] },
  { question: 'What is your biggest competitive advantage?', referenceAnswer: 'Tie to position needs, prove with concrete results: technical depth, project experience, learning speed.', categoryName: '自我介绍', difficulty: QuestionDifficulty.MEDIUM, tags: ['Self-Awareness', 'General'] },
  { question: 'What is your view on overtime?', referenceAnswer: 'Express willingness when necessary while emphasizing efficiency. Focus on working efficiently to reduce unnecessary overtime.', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, tags: ['Work-Life Balance', 'General'] },
  { question: 'What technology are you currently learning?', referenceAnswer: 'Choose technology relevant to the position. Describe learning motivation, method, progress, and practical output.', categoryName: '自我介绍', difficulty: QuestionDifficulty.EASY, tags: ['Learning', 'General'], company: 'Meituan' },
  { question: 'What unique value can you bring to the company?', referenceAnswer: 'From technical expertise, industry experience, problem-solving approach — tied to position requirements.', categoryName: '自我介绍', difficulty: QuestionDifficulty.MEDIUM, tags: ['Value', 'General'], company: 'Meituan' },
  { question: 'Why did you leave your last job/internship?', referenceAnswer: 'State objectively: seeking bigger challenges, career direction change, platform growth. Avoid criticizing former employers.', categoryName: '自我介绍', difficulty: QuestionDifficulty.MEDIUM, tags: ['Self Introduction', 'General'] },
  { question: 'How do you stay up to date professionally?', referenceAnswer: 'Reading, courses, open-source contributions, tech communities, internal sharing. Give a recent example.', categoryName: '自我介绍', difficulty: QuestionDifficulty.MEDIUM, tags: ['Learning', 'General'] },

  // ==================== STAR Method ====================
  { question: 'Describe completing a task efficiently under tight deadlines', referenceAnswer: 'S: urgent context. T: what needed to be done. A: strategies (prioritization, task breakdown). R: on-time delivery and quality.', categoryName: 'STAR 法则', difficulty: QuestionDifficulty.MEDIUM, tags: ['Time Management', 'STAR'] },
  { question: 'Describe how you handled a mistake you made', referenceAnswer: 'Honestly describe the error. Focus on remedial actions, lessons learned, and how you prevented similar mistakes.', categoryName: 'STAR 法则', difficulty: QuestionDifficulty.MEDIUM, tags: ['Problem Solving', 'STAR'] },
  { question: 'Describe an experience helping someone', referenceAnswer: 'Show empathy and team spirit. Describe why you helped, how you helped, and the impact.', categoryName: 'STAR 法则', difficulty: QuestionDifficulty.EASY, tags: ['Empathy', 'STAR'] },
  { question: 'Describe learning something new to solve a problem', referenceAnswer: 'Highlight learning ability: what you learned, method, time invested, and how you applied it.', categoryName: 'STAR 法则', difficulty: QuestionDifficulty.MEDIUM, tags: ['Learning Ability', 'STAR'] },
  { question: 'Describe responding to negative feedback', referenceAnswer: 'Show growth mindset: feedback content, feelings and analysis, improvement measures, and results.', categoryName: 'STAR 法则', difficulty: QuestionDifficulty.MEDIUM, tags: ['Growth Mindset', 'STAR'] },
  { question: 'Describe driving a technical improvement in a project', referenceAnswer: 'S: Project problems. T: What to improve. A: How you convinced the team. R: Results (performance, quality).', categoryName: 'STAR 法则', difficulty: QuestionDifficulty.MEDIUM, tags: ['Technical Improvement', 'STAR'] },
  { question: 'Describe working with a difficult colleague', referenceAnswer: 'Show emotional intelligence: colleague traits, strategy adjustments, building a working relationship, and collaboration results.', categoryName: 'STAR 法则', difficulty: QuestionDifficulty.HARD, tags: ['Interpersonal Skills', 'STAR'] },
  { question: 'Describe proactively discovering and solving a problem', referenceAnswer: 'S: Problem background. T: Impact. A: Discovery process, analysis, solution. R: Improvement effect.', categoryName: 'STAR 法则', difficulty: QuestionDifficulty.MEDIUM, tags: ['Initiative', 'STAR'] },
  { question: 'Describe making a difficult trade-off decision', referenceAnswer: 'S: Dilemma. T: Goal. A: How you weighed options, decision rationale. R: Outcome and retrospective.', categoryName: 'STAR 法则', difficulty: QuestionDifficulty.HARD, tags: ['Decision Making', 'STAR'], company: 'Huawei' },
  { question: 'Describe handling an emergency incident', referenceAnswer: 'S: Incident description. A: Quick response, communication, decision. R: Outcome and post-mortem.', categoryName: 'STAR 法则', difficulty: QuestionDifficulty.HARD, tags: ['Emergency Response', 'STAR'], company: 'Huawei' },

  // ==================== Career Planning ====================
  { question: 'What is your 5-year career plan?', referenceAnswer: 'Describe in phases: years 1-2 deepening skills, years 3-5 becoming a domain expert or team lead. Align with the target company.', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, tags: ['Career Planning'] },
  { question: 'What kind of work environment do you prefer?', referenceAnswer: 'Describe ideal team atmosphere, technical culture, management style — matching the target company.', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, tags: ['Career Planning', 'Culture'] },
  { question: 'What are your salary expectations?', referenceAnswer: 'Give a range based on market rates. "I value growth opportunities and hope salary reflects my abilities."', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, tags: ['Salary Negotiation'] },
  { question: 'How do you view the tech vs management career path?', referenceAnswer: 'Technology is the foundation, management amplifies it. Express interest in technical depth or management breadth per your plan.', categoryName: '职业规划', difficulty: QuestionDifficulty.MEDIUM, tags: ['Career Path'], company: 'Baidu' },
  { question: 'How long do you plan to stay at this company?', referenceAnswer: 'Express long-term commitment: "I hope to grow stably with the company and make lasting contributions."', categoryName: '职业规划', difficulty: QuestionDifficulty.EASY, tags: ['Career Planning', 'Stability'] },

  // ==================== Scenario Simulation ====================
  { question: 'What if you disagreed with your supervisor?', referenceAnswer: 'Express views and reasoning, listen to their considerations, request data-based verification if needed, ultimately respect the decision.', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, tags: ['Scenario', 'Communication'] },
  { question: 'What if a critical bug was found before launch?', referenceAnswer: 'Assess severity and fix cost. If core functionality is affected, delay launch. If limited, launch and patch next version. Notify stakeholders.', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, tags: ['Scenario', 'Emergency'] },
  { question: 'What if assigned an unfamiliar domain?', referenceAnswer: 'Learn quickly: docs, code review, consult colleagues. Create a learning plan, learn by doing, summarize regularly.', categoryName: '情景模拟', difficulty: QuestionDifficulty.EASY, tags: ['Scenario', 'Learning'] },
  { question: 'What if your module had a production incident?', referenceAnswer: 'Scope impact → mitigate (rollback/rate-limit) → root cause analysis → fix → post-mortem. Prioritize recovery.', categoryName: '情景模拟', difficulty: QuestionDifficulty.HARD, tags: ['Scenario', 'Incident'] },
  { question: 'What if two managers assign conflicting tasks?', referenceAnswer: 'Communicate with both, explain the conflict, ask them to coordinate priority or negotiate deadline extensions.', categoryName: '情景模拟', difficulty: QuestionDifficulty.HARD, tags: ['Scenario', 'Conflict'], company: 'JD.com' },
  { question: 'What if product requirements suddenly change?', referenceAnswer: 'Assess impact, communicate on timeline, break down priorities, request resources. Focus on solutions.', categoryName: '情景模拟', difficulty: QuestionDifficulty.MEDIUM, tags: ['Scenario', 'Requirements'], company: 'JD.com' },

  // ==================== Data Structures & Algorithms ====================
  { question: 'What is the time complexity of binary search?', referenceAnswer: 'O(log n). Each step halves the search space. Requires sorted data.', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.EASY, tags: ['Algorithm', 'Search'] },
  { question: 'Explain the difference between a stack and a queue', referenceAnswer: 'Stack: LIFO (Last In First Out). Queue: FIFO (First In First Out).', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.EASY, tags: ['Data Structure'] },
  { question: 'Merge sort vs quick sort?', referenceAnswer: 'Merge sort: stable, O(n log n) guaranteed, O(n) extra space. Quick sort: unstable, O(n log n) average, O(n²) worst, in-place.', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, tags: ['Algorithm', 'Sorting'] },
  { question: 'Explain hash table collision resolution', referenceAnswer: 'Chaining: each bucket is a linked list. Open addressing: probe for next empty slot (linear, quadratic, double hashing).', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, tags: ['Data Structure', 'Hash'] },
  { question: 'What is a Bloom filter?', referenceAnswer: 'Probabilistic data structure using bit array + multiple hash functions. Has false positives but no false negatives. Used for cache miss filtering.', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, tags: ['Data Structure', 'Probability'], company: 'Meituan' },
  { question: 'What is a Trie? Use cases?', referenceAnswer: 'Prefix tree for string matching. Each node stores a character; paths form prefixes. Used for: autocomplete, spell check, IP routing.', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, tags: ['Data Structure', 'Trie'], company: 'Xiaohongshu' },
  { question: 'What is the Master Theorem?', referenceAnswer: 'Analyzes recurrence T(n)=aT(n/b)+f(n). Gives closed-form complexity for divide-and-conquer algorithms.', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.HARD, tags: ['Algorithm', 'Complexity'], company: 'ByteDance' },
  { question: 'What is Morris traversal?', referenceAnswer: 'O(1) space binary tree traversal. Uses leaf node null pointers to store backtracking info, restores after traversal.', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.HARD, tags: ['Binary Tree'], company: 'ByteDance' },
  { question: 'What is A* search algorithm?', referenceAnswer: 'Heuristic search: f(n)=g(n)+h(n). g = actual cost, h = heuristic estimate. Used for pathfinding.', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.HARD, tags: ['Graph Theory'], company: 'NetEase' },
  // DS&A - Multiple Choice
  { question: 'Which sorting algorithm is stable?', referenceAnswer: 'C. Merge sort is stable. Quick, heap, selection are unstable.', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'Quick sort', isCorrect: false },
    { label: 'B', value: 'Heap sort', isCorrect: false },
    { label: 'C', value: 'Merge sort', isCorrect: true },
    { label: 'D', value: 'Selection sort', isCorrect: false },
  ], tags: ['Algorithm', 'Sorting'], company: 'Meituan' },
  { question: 'Which data structure does not support random access?', referenceAnswer: 'B. Linked lists require O(n) traversal.', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'Array', isCorrect: false },
    { label: 'B', value: 'Linked list', isCorrect: true },
    { label: 'C', value: 'Hash table', isCorrect: false },
    { label: 'D', value: 'Stack', isCorrect: false },
  ], tags: ['Data Structure'] },
  { question: 'Prerequisite for binary search?', referenceAnswer: 'B. Data must be sorted.', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'Large data size', isCorrect: false },
    { label: 'B', value: 'Sorted data', isCorrect: true },
    { label: 'C', value: 'No duplicates', isCorrect: false },
    { label: 'D', value: 'Integer values only', isCorrect: false },
  ], tags: ['Algorithm'], company: 'Huawei' },
  // DS&A - True/False
  { question: 'Hash table lookup can be O(1)', referenceAnswer: 'True. Direct key-to-position mapping, though collisions may degrade performance.', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: 'True', value: 'true', isCorrect: true },
    { label: 'False', value: 'false', isCorrect: false },
  ], tags: ['Data Structure'], company: 'Huawei' },
  { question: 'Quick sort is a stable sorting algorithm', referenceAnswer: 'False. Equal elements may change relative order.', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: 'True', value: 'true', isCorrect: false },
    { label: 'False', value: 'false', isCorrect: true },
  ], tags: ['Algorithm'], company: 'Xiaohongshu' },
  { question: 'B+ tree leaf nodes are connected by linked list', referenceAnswer: 'True. All data in B+ trees resides in leaf nodes, linked for efficient range queries.', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: 'True', value: 'true', isCorrect: true },
    { label: 'False', value: 'false', isCorrect: false },
  ], tags: ['Data Structure'], company: 'Baidu' },
  { question: 'Two stacks can simulate a queue', referenceAnswer: 'True. Stack1 for enqueue, Stack2 for dequeue. Pop all from Stack1 into Stack2 when Stack2 is empty.', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: 'True', value: 'true', isCorrect: true },
    { label: 'False', value: 'false', isCorrect: false },
  ], tags: ['Data Structure'], company: 'ByteDance' },
  { question: 'DFS of a binary tree includes preorder, inorder, and postorder', referenceAnswer: 'True. DFS includes preorder, inorder, postorder. BFS is level-order traversal.', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: 'True', value: 'true', isCorrect: true },
    { label: 'False', value: 'false', isCorrect: false },
  ], tags: ['Binary Tree'], company: 'Baidu' },
  // DS&A - Short Answer
  { question: 'Briefly explain dynamic programming', referenceAnswer: 'Break problems into overlapping subproblems, use memoization to avoid redundant computation. Key: state definition, transition equation, base cases.', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['Algorithm'], company: 'ByteDance' },
  { question: 'Briefly explain topological sorting', referenceAnswer: 'Order vertices in a DAG such that for every directed edge u→v, u comes before v. BFS (Kahn\'s) or DFS-based. Detects cycles.', categoryName: '数据结构与算法', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['Graph Theory'], company: 'Tencent' },

  // ==================== Computer Networks ====================
  { question: 'Explain the TCP three-way handshake', referenceAnswer: 'SYN → SYN-ACK → ACK. Confirms both sides can send/receive, negotiates initial sequence numbers, establishes the connection.', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, tags: ['TCP', 'Network'] },
  { question: 'Difference between HTTP and HTTPS?', referenceAnswer: 'HTTPS = HTTP + TLS/SSL encryption. Port 443 vs 80. Provides encryption, integrity, and authentication.', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, tags: ['HTTP', 'Security'] },
  { question: 'What is cross-origin? Solutions?', referenceAnswer: 'Different protocol, domain, or port. Solutions: CORS, server proxy, JSONP, postMessage.', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.SHORT_ANSWER, tags: ['Frontend', 'Security'], company: 'ByteDance' },
  { question: 'Describe URL to page rendering process', referenceAnswer: 'DNS → TCP → HTTP request → server response → parse HTML → DOM/CSSOM → render tree → layout → paint.', categoryName: '计算机网络', difficulty: QuestionDifficulty.HARD, tags: ['Browser', 'Network'] },
  { question: 'TCP vs UDP?', referenceAnswer: 'TCP: connection-oriented, reliable, ordered, flow/congestion control. UDP: connectionless, unreliable, fast, used for video/gaming.', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, tags: ['TCP', 'UDP'] },
  { question: 'What is HTTP/2 multiplexing?', referenceAnswer: 'Multiple requests on single connection, frames interleaved. Solves HTTP/1.1 head-of-line blocking.', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, tags: ['HTTP'] },
  { question: 'What is the ARP protocol?', referenceAnswer: 'Resolves IP addresses to MAC addresses for same-LAN communication.', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, tags: ['ARP', 'Network'] },
  // Networks - Choice
  { question: 'Default port for HTTPS?', referenceAnswer: 'B. HTTPS uses port 443; HTTP uses port 80.', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '80', isCorrect: false },
    { label: 'B', value: '443', isCorrect: true },
    { label: 'C', value: '8080', isCorrect: false },
    { label: 'D', value: '3000', isCorrect: false },
  ], tags: ['HTTP'] },
  { question: 'Which HTTP status code means "Unauthorized"?', referenceAnswer: 'B. 401 Unauthorized.', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: '400', isCorrect: false },
    { label: 'B', value: '401', isCorrect: true },
    { label: 'C', value: '403', isCorrect: false },
    { label: 'D', value: '404', isCorrect: false },
  ], tags: ['HTTP'], company: 'Alibaba' },
  { question: 'TCP flow control relies on?', referenceAnswer: 'B. Sliding window. Receiver advertises window size, sender limits accordingly.', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'Congestion window', isCorrect: false },
    { label: 'B', value: 'Sliding window', isCorrect: true },
    { label: 'C', value: 'Retransmission timer', isCorrect: false },
    { label: 'D', value: 'Checksum', isCorrect: false },
  ], tags: ['TCP'] },
  // Networks - True/False
  { question: 'HTTP is a stateless protocol', referenceAnswer: 'True. HTTP does not save client state between requests. Session/Cookie/Token are application-level solutions.', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: 'True', value: 'true', isCorrect: true },
    { label: 'False', value: 'false', isCorrect: false },
  ], tags: ['HTTP'] },
  { question: 'HTTPS encryption only occurs during connection establishment', referenceAnswer: 'False. Keys are negotiated during handshake, then all application data is encrypted.', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: 'True', value: 'true', isCorrect: false },
    { label: 'False', value: 'false', isCorrect: true },
  ], tags: ['HTTPS'] },
  { question: 'TCP reliable transmission relies on sequence and acknowledgment numbers', referenceAnswer: 'True. Sequence numbers identify data, acknowledgment numbers indicate expected next byte.', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: 'True', value: 'true', isCorrect: true },
    { label: 'False', value: 'false', isCorrect: false },
  ], tags: ['TCP'] },
  // Networks - Short Answer
  { question: 'Briefly explain TCP three-way handshake purpose', referenceAnswer: 'Confirm both sides can send/receive, negotiate initial sequence numbers, establish connection. Prevent stale connection requests.', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['TCP'] },
  { question: 'Briefly explain HTTP statelessness and common solutions', referenceAnswer: 'Server does not save state between requests. Solutions: Cookie, Session, Token, JWT.', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.SHORT_ANSWER, tags: ['HTTP'] },

  // ==================== Operating Systems ====================
  { question: 'Process vs thread?', referenceAnswer: 'Process: independent memory space, resource allocation unit. Thread: lightweight, shares memory within a process, scheduling unit.', categoryName: '操作系统', difficulty: QuestionDifficulty.EASY, tags: ['Process', 'Thread'] },
  { question: 'What are the conditions for deadlock?', referenceAnswer: 'Mutual exclusion, hold and wait, no preemption, circular wait. Break any one to prevent deadlock.', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, tags: ['Deadlock'] },
  { question: 'Explain virtual memory', referenceAnswer: 'Programs use virtual addresses mapped to physical memory via page tables. Allows using more memory than physically available through page swapping.', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, tags: ['Memory'] },
  { question: 'What is Copy-on-Write?', referenceAnswer: 'Shared memory on fork; copy only occurs on write. Used in process creation, Docker images.', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, tags: ['Memory'] },
  { question: 'Explain epoll vs select', referenceAnswer: 'epoll: event-driven, no FD limit, O(1) notification, shared memory. select: polling, FD limit, O(n). epoll preferred for high concurrency.', categoryName: '操作系统', difficulty: QuestionDifficulty.HARD, tags: ['IO', 'Linux'] },
  { question: 'Describe the Banker\'s algorithm for deadlock avoidance', referenceAnswer: 'Check if a safe sequence exists before allocation. If system remains in safe state after allocation, proceed; otherwise reject.', categoryName: '操作系统', difficulty: QuestionDifficulty.HARD, tags: ['Deadlock'] },
  // OS - Choice
  { question: 'Three basic process states?', referenceAnswer: 'A. Ready, Running, Blocked.', categoryName: '操作系统', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'Ready, Running, Blocked', isCorrect: true },
    { label: 'B', value: 'Created, Destroyed, Suspended', isCorrect: false },
    { label: 'C', value: 'User mode, Kernel mode', isCorrect: false },
    { label: 'D', value: 'Waiting, Executing, Complete', isCorrect: false },
  ], tags: ['Process'], company: 'NetEase' },
  { question: 'What signal does Linux kill -9 send?', referenceAnswer: 'B. SIGKILL. Cannot be caught or ignored.', categoryName: '操作系统', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'SIGTERM', isCorrect: false },
    { label: 'B', value: 'SIGKILL', isCorrect: true },
    { label: 'C', value: 'SIGINT', isCorrect: false },
    { label: 'D', value: 'SIGHUP', isCorrect: false },
  ], tags: ['Linux'], company: 'Baidu' },
  // OS - True/False
  { question: 'A process is a single execution of a program', referenceAnswer: 'True. A process is a program running on a dataset — the basic unit for resource allocation.', categoryName: '操作系统', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: 'True', value: 'true', isCorrect: true },
    { label: 'False', value: 'false', isCorrect: false },
  ], tags: ['Process'], company: 'JD.com' },
  { question: 'User threads are visible to the OS kernel', referenceAnswer: 'False. User threads are managed in user space; the kernel only sees kernel threads.', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: 'True', value: 'true', isCorrect: false },
    { label: 'False', value: 'false', isCorrect: true },
  ], tags: ['Thread'] },
  // OS - Short Answer
  { question: 'Briefly explain memory alignment', referenceAnswer: 'Data placed on 2/4/8-byte boundaries. Reason: CPU accesses memory by word; misaligned access may require multiple reads or cause exceptions.', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['Memory'] },
  { question: 'Briefly explain spin lock vs mutex', referenceAnswer: 'Spin lock: busy-wait, for very short critical sections, multi-core. Mutex: sleep-wait, for longer critical sections.', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['Lock'] },
  { question: 'Briefly explain page table function', referenceAnswer: 'Maps virtual page numbers to physical frame numbers. Supports virtual memory, permission checks, page fault handling.', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['Memory'] },

  // ==================== Database ====================
  { question: 'MySQL InnoDB vs MyISAM?', referenceAnswer: 'InnoDB: transactions, row locking, foreign keys, MVCC. MyISAM: no transactions, table locking, faster reads.', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, tags: ['MySQL'] },
  { question: 'Explain database indexing', referenceAnswer: 'Data structure that speeds up queries. B+ tree most common. Trade-off: faster reads but slower writes.', categoryName: '数据库', difficulty: QuestionDifficulty.EASY, tags: ['MySQL', 'Index'] },
  { question: 'What is database sharding?', referenceAnswer: 'Horizontal partitioning: distribute data by rules (hash/range). Handle cross-shard queries and transactions.', categoryName: '数据库', difficulty: QuestionDifficulty.HARD, tags: ['Sharding'], company: 'JD.com' },
  { question: 'What is Redis cache-database consistency?', referenceAnswer: 'Cache Aside: read-through, delete cache on write. Delayed double-delete. Canal binlog subscription. Distributed lock for strong consistency.', categoryName: '数据库', difficulty: QuestionDifficulty.HARD, tags: ['Redis', 'Consistency'] },
  { question: 'Common causes of index failure?', referenceAnswer: 'Functions on indexed column, implicit type conversion, left-wildcard LIKE, OR with non-indexed columns, not following leftmost prefix.', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['MySQL'] },
  { question: 'Explain dirty read, non-repeatable read, phantom read', referenceAnswer: 'Dirty read: read uncommitted data. Non-repeatable read: different values on re-read (UPDATE). Phantom read: different row count (INSERT/DELETE).', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['Transaction'] },
  { question: 'Explain MySQL gap lock', referenceAnswer: 'Locks the gap between index records to prevent phantom reads. InnoDB uses Next-Key Lock (row lock + gap lock) under RR isolation.', categoryName: '数据库', difficulty: QuestionDifficulty.HARD, tags: ['MySQL', 'Lock'] },
  { question: 'Redis big key problem and solutions', referenceAnswer: 'Single key too large (large hash/list) causes blocking and network congestion. Solutions: split, compress, async delete (UNLINK).', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, tags: ['Redis'] },
  // Database - Choice
  { question: 'Which is not a NoSQL database?', referenceAnswer: 'C. PostgreSQL is a relational database.', categoryName: '数据库', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'Redis', isCorrect: false },
    { label: 'B', value: 'MongoDB', isCorrect: false },
    { label: 'C', value: 'PostgreSQL', isCorrect: true },
    { label: 'D', value: 'Cassandra', isCorrect: false },
  ], tags: ['Database'], company: 'Tencent' },
  { question: 'When is MySQL InnoDB redo log flushed to disk?', referenceAnswer: 'B. On transaction commit. Ensures durability. Configurable via innodb_flush_log_at_trx_commit.', categoryName: '数据库', difficulty: QuestionDifficulty.HARD, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'On transaction start', isCorrect: false },
    { label: 'B', value: 'On transaction commit', isCorrect: true },
    { label: 'C', value: 'On transaction rollback', isCorrect: false },
    { label: 'D', value: 'Once per second', isCorrect: false },
  ], tags: ['MySQL'] },
  { question: 'Can Redis RDB and AOF be enabled simultaneously?', referenceAnswer: 'B. Yes. On restart, AOF is preferred (more complete). 4.0+ supports hybrid persistence.', categoryName: '数据库', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'No', isCorrect: false },
    { label: 'B', value: 'Yes', isCorrect: true },
    { label: 'C', value: 'Must choose one', isCorrect: false },
    { label: 'D', value: 'Only in cluster mode', isCorrect: false },
  ], tags: ['Redis'] },
  // Database - True/False
  { question: 'MySQL DELETE can be rolled back', referenceAnswer: 'True. DELETE within a transaction can be rolled back. TRUNCATE cannot.', categoryName: '数据库', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: 'True', value: 'true', isCorrect: true },
    { label: 'False', value: 'false', isCorrect: false },
  ], tags: ['MySQL'], company: 'Huawei' },
  { question: 'More indexes always means faster queries', referenceAnswer: 'False. Indexes slow writes, consume storage, and may confuse the optimizer. Index wisely.', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: 'True', value: 'true', isCorrect: false },
    { label: 'False', value: 'false', isCorrect: true },
  ], tags: ['MySQL'], company: 'Huawei' },
  { question: 'Redis ZSet uses a skip list internally', referenceAnswer: 'True. ZSet uses skip list for range queries and hash table for O(1) lookup.', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: 'True', value: 'true', isCorrect: true },
    { label: 'False', value: 'false', isCorrect: false },
  ], tags: ['Redis'], company: 'NetEase' },
  { question: 'Kafka messages are persisted to disk', referenceAnswer: 'True. Kafka persists messages to log files with retention policies and timestamp-based replay.', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: 'True', value: 'true', isCorrect: true },
    { label: 'False', value: 'false', isCorrect: false },
  ], tags: ['Kafka'], company: 'Xiaohongshu' },

  // ==================== System Design ====================
  { question: 'How to design a URL shortener?', referenceAnswer: 'ID generator (snowflake/Redis), storage mapping, 302 redirect, distributed, deduplication, analytics.', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, tags: ['System Design'] },
  { question: 'How to design a flash sale system?', referenceAnswer: 'Frontend rate limiting, CDN, Redis stock pre-decrement, message queue async ordering, optimistic locking, distributed locks.', categoryName: '系统设计', difficulty: QuestionDifficulty.HARD, questionType: QuestionType.SHORT_ANSWER, tags: ['System Design', 'High Concurrency'] },
  { question: 'What is the CAP theorem?', referenceAnswer: 'Distributed systems can only guarantee two of: Consistency, Availability, Partition tolerance. Choose CP or AP during partitions.', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, tags: ['Distributed Systems'] },
  { question: 'What is CI/CD?', referenceAnswer: 'Continuous Integration (auto build/test) and Continuous Delivery/Deployment (auto deploy). Jenkins, GitLab CI, GitHub Actions.', categoryName: '系统设计', difficulty: QuestionDifficulty.EASY, tags: ['DevOps'], company: 'Baidu' },
  { question: 'What is circuit breaking and degradation?', referenceAnswer: 'Circuit breaking: fail-fast on dependency failure. Degradation: disable non-critical features to protect core. Hystrix, Sentinel.', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['High Availability'], company: 'Meituan' },
  { question: 'What is the Raft consensus algorithm?', referenceAnswer: 'Leader election, log replication, safety. Leader handles requests, replicates to majority. Easier than Paxos. Used by etcd, Consul.', categoryName: '系统设计', difficulty: QuestionDifficulty.HARD, tags: ['Distributed Systems'], company: 'ByteDance' },
  { question: 'What is Service Mesh?', referenceAnswer: 'Sidecar pattern: extract traffic management, observability, security from apps. Istio, Linkerd. Decouples business from infrastructure.', categoryName: '系统设计', difficulty: QuestionDifficulty.HARD, tags: ['Microservices', 'Cloud Native'], company: 'Huawei' },
  { question: 'What is idempotency?', referenceAnswer: 'Same operation executed multiple times has same effect as once. Important for retries and message redelivery. Implement via unique IDs, DB constraints, state machines.', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, tags: ['Distributed Systems'], company: 'Tencent' },
  // System Design - Choice
  { question: 'Which is NOT a common high availability technique?', referenceAnswer: 'D. Single-point deployment is an anti-pattern.', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'Multi-replica redundancy', isCorrect: false },
    { label: 'B', value: 'Circuit breaking', isCorrect: false },
    { label: 'C', value: 'Multi-region deployment', isCorrect: false },
    { label: 'D', value: 'Single-point deployment', isCorrect: true },
  ], tags: ['System Design'] },
  { question: 'Message queue main purpose does NOT include?', referenceAnswer: 'D. MQ is for decoupling, peak shaving, async. It does not directly improve single-machine CPU performance.', categoryName: '系统设计', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'Decoupling', isCorrect: false },
    { label: 'B', value: 'Peak shaving', isCorrect: false },
    { label: 'C', value: 'Async processing', isCorrect: false },
    { label: 'D', value: 'Boost single-machine CPU', isCorrect: true },
  ], tags: ['Message Queue'] },
  { question: 'Distributed lock is typically NOT implemented via?', referenceAnswer: 'C. Local synchronized only works for single machine. Redis, ZooKeeper, DB can implement distributed locks.', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'Redis', isCorrect: false },
    { label: 'B', value: 'ZooKeeper', isCorrect: false },
    { label: 'C', value: 'Local synchronized', isCorrect: true },
    { label: 'D', value: 'Database unique constraint', isCorrect: false },
  ], tags: ['Distributed Lock'] },
  // System Design - True/False
  { question: 'Strong consistency and high availability can coexist in distributed systems', referenceAnswer: 'False. Per CAP theorem, during partitions only CP or AP is possible.', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: 'True', value: 'true', isCorrect: false },
    { label: 'False', value: 'false', isCorrect: true },
  ], tags: ['Distributed Systems'], company: 'Meituan' },
  { question: 'Docker containers provide full OS-level isolation like VMs', referenceAnswer: 'False. Docker containers share the host kernel. VMs provide full OS-level isolation.', categoryName: '系统设计', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: 'True', value: 'true', isCorrect: false },
    { label: 'False', value: 'false', isCorrect: true },
  ], tags: ['Docker'], company: 'Huawei' },
  { question: 'Microservice granularity: the finer the better', referenceAnswer: 'False. Too fine increases network overhead and complexity. Divide by business boundaries.', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: 'True', value: 'true', isCorrect: false },
    { label: 'False', value: 'false', isCorrect: true },
  ], tags: ['Microservices'] },

  // ==================== ByteDance ====================
  { question: 'How to implement deep copy in JavaScript?', referenceAnswer: 'JSON.parse(JSON.stringify) for simple cases. Recursive traversal + WeakMap for circular refs. Or lodash cloneDeep.', categoryName: 'ByteDance', difficulty: QuestionDifficulty.MEDIUM, tags: ['JavaScript', 'Frontend'], company: 'ByteDance' },
  { question: 'Vue reactivity principle?', referenceAnswer: 'Vue 2: Object.defineProperty. Vue 3: Proxy. Dependency collection on get, dispatch updates on set.', categoryName: 'ByteDance', difficulty: QuestionDifficulty.MEDIUM, tags: ['Vue', 'Frontend'], company: 'ByteDance' },
  { question: 'What is Virtual DOM and diff algorithm?', referenceAnswer: 'JS objects describing DOM, reducing direct manipulation. Diff: same-level comparison, key optimization, minimal updates.', categoryName: 'ByteDance', difficulty: QuestionDifficulty.MEDIUM, tags: ['Frontend'], company: 'ByteDance' },
  { question: 'Explain closure and its use cases', referenceAnswer: 'A function with its lexical scope. Uses: data privacy, currying, debounce/throttle, modules. Watch for memory leaks.', categoryName: 'ByteDance', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['JavaScript'], company: 'ByteDance' },
  { question: 'Explain debounce vs throttle', referenceAnswer: 'Debounce: fire only after last trigger in series (search input). Throttle: fire at fixed intervals (scroll).', categoryName: 'ByteDance', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.SHORT_ANSWER, tags: ['Frontend'], company: 'ByteDance' },
  { question: 'Explain Event Loop macro/micro tasks', referenceAnswer: 'Macro: setTimeout, setInterval, I/O. Micro: Promise.then, MutationObserver. All micro tasks flushed after each macro task.', categoryName: 'ByteDance', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['JavaScript'], company: 'ByteDance' },
  { question: 'Explain XSS and CSRF defense', referenceAnswer: 'XSS: escaping, CSP, HttpOnly. CSRF: Token, SameSite cookie, Referer check, double cookie.', categoryName: 'ByteDance', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['Security'], company: 'ByteDance' },
  { question: 'Explain React key prop purpose', referenceAnswer: 'Helps diff algorithm identify list items for reuse/reorder vs rebuild. Key should be stable and unique; avoid using index for dynamic lists.', categoryName: 'ByteDance', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['React'], company: 'ByteDance' },
  // ByteDance - Choice
  { question: 'Which is NOT a JavaScript primitive type?', referenceAnswer: 'D. Array is a reference type.', categoryName: 'ByteDance', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'undefined', isCorrect: false },
    { label: 'B', value: 'null', isCorrect: false },
    { label: 'C', value: 'symbol', isCorrect: false },
    { label: 'D', value: 'Array', isCorrect: true },
  ], tags: ['JavaScript'], company: 'ByteDance' },
  { question: 'Which product does NOT belong to ByteDance?', referenceAnswer: 'C. Taobao belongs to Alibaba. ByteDance owns TikTok/Douyin, Toutiao, Feishu/Lark.', categoryName: 'ByteDance', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, company: 'ByteDance', options: [
    { label: 'A', value: 'TikTok/Douyin', isCorrect: false },
    { label: 'B', value: 'Feishu/Lark', isCorrect: false },
    { label: 'C', value: 'Taobao', isCorrect: true },
    { label: 'D', value: 'Toutiao', isCorrect: false },
  ], tags: ['ByteDance', 'Company'] },
  // ByteDance - True/False
  { question: 'JavaScript is single-threaded', referenceAnswer: 'True. JS main thread is single-threaded, using event loop for async. Web Workers available for multi-threading.', categoryName: 'ByteDance', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: 'True', value: 'true', isCorrect: true },
    { label: 'False', value: 'false', isCorrect: false },
  ], tags: ['JavaScript'], company: 'ByteDance' },
  { question: 'TypeScript is a superset of JavaScript', referenceAnswer: 'True. TypeScript includes all JS features plus static typing. Compiles to JavaScript.', categoryName: 'ByteDance', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: 'True', value: 'true', isCorrect: true },
    { label: 'False', value: 'false', isCorrect: false },
  ], tags: ['TypeScript'], company: 'ByteDance' },
  { question: 'Frontend engineering must use Webpack', referenceAnswer: 'False. Vite, Rollup, esbuild are also options. Engineering is a concept; tools are flexible.', categoryName: 'ByteDance', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, company: 'ByteDance', options: [
    { label: 'True', value: 'true', isCorrect: false },
    { label: 'False', value: 'false', isCorrect: true },
  ], tags: ['Frontend'] },
  { question: 'React Hooks can be called inside conditionals', referenceAnswer: 'False. Hooks must be called at top level to maintain consistent call order across renders.', categoryName: 'ByteDance', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: 'True', value: 'true', isCorrect: false },
    { label: 'False', value: 'false', isCorrect: true },
  ], tags: ['React'], company: 'ByteDance' },
  { question: 'async/await is syntactic sugar for Promises', referenceAnswer: 'True. async functions return Promises; await pauses until Promise resolves.', categoryName: 'ByteDance', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: 'True', value: 'true', isCorrect: true },
    { label: 'False', value: 'false', isCorrect: false },
  ], tags: ['JavaScript'] },

  // ==================== Tencent ====================
  { question: 'Webpack build process?', referenceAnswer: 'Init → compile (loaders) → module graph → chunks → bundle output. Loaders for non-JS; Plugins for extensions. Tree-shaking, code splitting, HMR.', categoryName: 'Tencent', difficulty: QuestionDifficulty.MEDIUM, tags: ['Frontend', 'Engineering'], company: 'Tencent' },
  { question: 'Node.js event loop vs browser?', referenceAnswer: 'Node has phases: timer, I/O, idle, poll, check, close. No UI rendering. process.nextTick and setImmediate differ.', categoryName: 'Tencent', difficulty: QuestionDifficulty.HARD, tags: ['Node.js'], company: 'Tencent' },
  { question: 'WeChat Mini Program rendering principle?', referenceAnswer: 'Dual-thread: logic layer (JS) and rendering layer (WebView) separated, communicate via native bridge. WXML → Virtual DOM → Render.', categoryName: 'Tencent', difficulty: QuestionDifficulty.HARD, questionType: QuestionType.SHORT_ANSWER, company: 'Tencent', tags: ['Mini Program'] },
  { question: 'Tencent Cloud and Alibaba Cloud both offer container services', referenceAnswer: 'True. Tencent Cloud TKE and Alibaba Cloud ACK are both managed K8s services.', categoryName: 'Tencent', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, company: 'Tencent', options: [
    { label: 'True', value: 'true', isCorrect: true },
    { label: 'False', value: 'false', isCorrect: false },
  ], tags: ['Cloud'] },

  // ==================== Alibaba ====================
  { question: 'Spring IoC and AOP principles?', referenceAnswer: 'IoC: Factory + reflection, dependency injection. AOP: Dynamic proxy (JDK/CGLIB), weaving before/after join points. For transactions, logging.', categoryName: 'Alibaba', difficulty: QuestionDifficulty.MEDIUM, tags: ['Java', 'Spring'], company: 'Alibaba' },
  { question: 'Java garbage collectors?', referenceAnswer: 'Serial, Parallel, CMS, G1, ZGC. G1 general-purpose; ZGC for low latency. Choose by throughput, pause time, heap size.', categoryName: 'Alibaba', difficulty: QuestionDifficulty.HARD, tags: ['Java', 'JVM'], company: 'Alibaba' },
  { question: 'OceanBase is an Alibaba open-source project', referenceAnswer: 'True. OceanBase is Alibaba\'s open-source distributed relational database, #1 on TPC-C.', categoryName: 'Alibaba', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, company: 'Alibaba', options: [
    { label: 'True', value: 'true', isCorrect: true },
    { label: 'False', value: 'false', isCorrect: false },
  ], tags: ['Database'] },
  { question: 'Dubbo is an Alibaba open-source RPC framework', referenceAnswer: 'True. Dubbo supports multiple protocols and registries for inter-service RPC.', categoryName: 'Alibaba', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, company: 'Alibaba', options: [
    { label: 'True', value: 'true', isCorrect: true },
    { label: 'False', value: 'false', isCorrect: false },
  ], tags: ['RPC'] },

  // ==================== Project Experience ====================
  { question: 'How do you approach performance optimization?', referenceAnswer: 'Frontend: lazy loading, CDN, caching, code splitting. Backend: indexes, Redis, connection pools, SQL optimization, async. Quantify with metrics.', categoryName: '项目经验', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['Project Experience', 'Performance'] },
  { question: 'How do you manage tech debt?', referenceAnswer: 'Identify, document, prioritize, schedule repayment, prevent new debt. Balance business needs and code quality.', categoryName: '项目经验', difficulty: QuestionDifficulty.MEDIUM, tags: ['Project Experience', 'Tech Debt'], company: 'Xiaohongshu' },
  { question: 'How do you push a technical initiative to completion?', referenceAnswer: 'Research, technical review, pilot validation, documentation, gradual rollout, monitoring. Emphasize persuasion and collaboration.', categoryName: '项目经验', difficulty: QuestionDifficulty.MEDIUM, tags: ['Project Experience'] },
  { question: 'What was the most complex project you worked on?', referenceAnswer: 'Describe from business complexity, technical difficulty, collaboration scale. Highlight your role and contributions.', categoryName: '项目经验', difficulty: QuestionDifficulty.MEDIUM, tags: ['Project Experience'] },
  { question: 'Performance optimization must be backed by data', referenceAnswer: 'True. Metrics like "QPS +50%" are convincing. Vague descriptions are not effective.', categoryName: '项目经验', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: 'True', value: 'true', isCorrect: true },
    { label: 'False', value: 'false', isCorrect: false },
  ], tags: ['Project Experience'] },
  { question: 'Quantified data is more convincing than qualitative descriptions', referenceAnswer: 'True. "QPS increased 50%" beats "performance improved".', categoryName: '项目经验', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: 'True', value: 'true', isCorrect: true },
    { label: 'False', value: 'false', isCorrect: false },
  ], tags: ['Project Experience'] },
  { question: 'What best demonstrates technical depth when presenting a project?', referenceAnswer: 'B. Technical challenges and architectural decisions showcase depth.', categoryName: '项目经验', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'A', value: 'Team size', isCorrect: false },
    { label: 'B', value: 'Technical challenges & architectural decisions', isCorrect: true },
    { label: 'C', value: 'Project duration', isCorrect: false },
    { label: 'D', value: 'List of technologies used', isCorrect: false },
  ], tags: ['Project Experience'] },

  // ==================== Other Companies ====================
  { question: 'MySQL EXPLAIN fields meaning?', referenceAnswer: 'type (access type), key (index used), rows (estimated rows), Extra. Check type is ref or better; avoid ALL.', categoryName: 'Meituan', difficulty: QuestionDifficulty.MEDIUM, tags: ['MySQL', 'Performance'], company: 'Meituan' },
  { question: 'Core concepts of Kubernetes?', referenceAnswer: 'Pod, Deployment, Service, Ingress, ConfigMap, Secret. Declarative API, controller pattern, scheduler.', categoryName: 'Baidu', difficulty: QuestionDifficulty.MEDIUM, tags: ['K8s', 'DevOps'], company: 'Baidu' },
  { question: 'What is Serverless?', referenceAnswer: 'On-demand execution, auto-scaling, no server management. AWS Lambda, cloud functions. Good for event-driven workloads.', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, tags: ['Cloud Native'], company: 'Xiaohongshu' },
  { question: 'How to design a Feed system?', referenceAnswer: 'Push model (write fan-out), pull model (read fan-out), or hybrid. Redis timeline + DB + MQ. Consider follower count and activity.', categoryName: '系统设计', difficulty: QuestionDifficulty.HARD, tags: ['System Design'], company: 'ByteDance' },
  { question: 'How to design a delay queue?', referenceAnswer: 'Redis sorted set (score=execution time), RabbitMQ delay plugin, timing wheel, DB polling. Consider precision and scale.', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, tags: ['Message Queue'], company: 'Meituan' },
  { question: 'What are the three pillars of observability?', referenceAnswer: 'Metrics, Logging, Tracing. Prometheus, ELK, Jaeger. Monitor state, record events, trace request chains.', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, tags: ['DevOps', 'Monitoring'], company: 'Huawei' },
  { question: 'What is GraphQL vs REST?', referenceAnswer: 'Client defines data shape, fetches multiple resources in one request. Reduces over/under-fetching. Single flexible endpoint vs fixed REST endpoints.', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, tags: ['API'], company: 'NetEase' },
  { question: 'What is database connection pool warmup?', referenceAnswer: 'Pre-create connections at startup to avoid cold-start latency on first requests. Configure initial pool size.', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['Connection Pool'], company: 'NetEase' },
  { question: 'What is API versioning?', referenceAnswer: 'URL path (/v1/), headers, or query params to identify versions. Support multiple versions, smooth migration.', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.SHORT_ANSWER, tags: ['API'], company: 'Xiaohongshu' },
  { question: 'What is frontend code splitting?', referenceAnswer: 'Split code into chunks, load on demand. Reduces initial bundle size. React.lazy, dynamic import, Webpack splitChunks.', categoryName: 'ByteDance', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['Frontend'], company: 'JD.com' },
  { question: 'What is frontend lazy loading?', referenceAnswer: 'Defer loading non-critical resources. Image lazy loading, route lazy loading, dynamic import. Improves first paint time.', categoryName: 'ByteDance', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.SHORT_ANSWER, tags: ['Frontend'], company: 'NetEase' },
  { question: 'What is distributed tracing?', referenceAnswer: 'Track request chains across services. TraceId, SpanId. Jaeger, Zipkin, SkyWalking. For performance analysis and fault diagnosis.', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['Observability'], company: 'Xiaohongshu' },
  { question: 'What is the BFF pattern?', referenceAnswer: 'Backend For Frontend. Custom aggregation layer for frontends, assembling multiple backend APIs, data transformation, reducing frontend requests.', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['Architecture'], company: 'ByteDance' },
  { question: 'What is a covering index?', referenceAnswer: 'All queried columns are in the index, no need for table lookup. EXPLAIN shows "Using index". Significant performance boost.', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['MySQL'], company: 'Baidu' },
  { question: 'What is frontend SSR?', referenceAnswer: 'Server-side rendering: server generates HTML. Pros: faster first paint, SEO. Cons: server load, complexity. Next.js, Nuxt.', categoryName: 'ByteDance', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.SHORT_ANSWER, tags: ['Frontend', 'SSR'], company: 'Tencent' },
  { question: 'What is QUIC 0-RTT?', referenceAnswer: 'After first connection, subsequent connections send data with 0 round trips using cached session keys.', categoryName: '计算机网络', difficulty: QuestionDifficulty.HARD, tags: ['QUIC'], company: 'Xiaohongshu' },
  { question: 'What is Redis Pub/Sub?', referenceAnswer: 'PUBLISH/SUBSCRIBE pattern. Publisher sends messages, subscribers receive. For real-time notifications. Does not persist messages.', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, tags: ['Redis'], company: 'Xiaohongshu' },
  { question: 'What is Redis cluster mode?', referenceAnswer: 'Data sharded across nodes via 16384 hash slots. Gossip protocol, no proxy. Supports horizontal scaling.', categoryName: '数据库', difficulty: QuestionDifficulty.HARD, tags: ['Redis'], company: 'Tencent' },
  { question: 'What is preemptive scheduling?', referenceAnswer: 'Higher priority processes can preempt lower ones. Time slice expiration triggers preemption. Improves responsiveness.', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, tags: ['Scheduling'], company: 'ByteDance' },
  { question: 'What is a page fault interrupt?', referenceAnswer: 'Triggered when accessed page is not in memory. OS loads the page, may require page replacement.', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, tags: ['Memory'], company: 'NetEase' },
  { question: 'What is the thundering herd problem?', referenceAnswer: 'Multiple processes/threads wait on same event; all are woken but only one handles it, others sleep again. Wastes resources. Solution: wake only one (epoll).', categoryName: '操作系统', difficulty: QuestionDifficulty.HARD, questionType: QuestionType.SHORT_ANSWER, tags: ['Concurrency'] },
  { question: 'What is mmap?', referenceAnswer: 'Map files/devices to process address space, read/write like memory. Uses: large file I/O, shared memory, malloc implementation.', categoryName: '操作系统', difficulty: QuestionDifficulty.HARD, questionType: QuestionType.SHORT_ANSWER, tags: ['Memory'] },
  { question: 'What is buffer overflow?', referenceAnswer: 'Writing beyond buffer boundary overwrites adjacent memory. May overwrite return address for code execution. Defense: bounds checking, ASLR, DEP.', categoryName: '操作系统', difficulty: QuestionDifficulty.HARD, tags: ['Security', 'Memory'] },

  // ==================== Choice Questions ====================
  { question: 'Which HTTP status code indicates "Not Found"?', referenceAnswer: '404', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: '200', value: 'A' }, { label: '301', value: 'B' }, { label: '404', value: 'C', isCorrect: true }, { label: '500', value: 'D' },
  ], tags: ['HTTP', 'Basics'] },
  { question: 'Which data structure uses FIFO (First In, First Out)?', referenceAnswer: 'Queue', categoryName: '技术面试', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'Stack', value: 'A' }, { label: 'Queue', value: 'B', isCorrect: true }, { label: 'Tree', value: 'C' }, { label: 'Hash Table', value: 'D' },
  ], tags: ['Data Structure', 'Basics'] },
  { question: 'What is the time complexity of binary search?', referenceAnswer: 'O(log n)', categoryName: '技术面试', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'O(n)', value: 'A' }, { label: 'O(log n)', value: 'B', isCorrect: true }, { label: 'O(n log n)', value: 'C' }, { label: 'O(1)', value: 'D' },
  ], tags: ['Algorithm', 'Basics'] },
  { question: 'Which SQL keyword is used to remove duplicate rows?', referenceAnswer: 'DISTINCT', categoryName: '数据库', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'UNIQUE', value: 'A' }, { label: 'DISTINCT', value: 'B', isCorrect: true }, { label: 'DIFFERENT', value: 'C' }, { label: 'SINGLE', value: 'D' },
  ], tags: ['SQL', 'Basics'] },
  { question: 'What does REST stand for?', referenceAnswer: 'Representational State Transfer', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'Remote State Transfer', value: 'A' }, { label: 'Representational State Transfer', value: 'B', isCorrect: true }, { label: 'Real-time State Transfer', value: 'C' }, { label: 'Resource State Transition', value: 'D' },
  ], tags: ['API', 'Basics'] },
  { question: 'In a B+ tree, where is the actual data stored?', referenceAnswer: 'Leaf nodes only', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'Root node', value: 'A' }, { label: 'All nodes', value: 'B' }, { label: 'Leaf nodes only', value: 'C', isCorrect: true }, { label: 'Internal nodes only', value: 'D' },
  ], tags: ['MySQL', 'Index'] },
  { question: 'Which sorting algorithm has the best average time complexity?', referenceAnswer: 'Quick Sort - O(n log n)', categoryName: '技术面试', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.CHOICE, options: [
    { label: 'Bubble Sort - O(n²)', value: 'A' }, { label: 'Quick Sort - O(n log n)', value: 'B', isCorrect: true }, { label: 'Insertion Sort - O(n²)', value: 'C' }, { label: 'Selection Sort - O(n²)', value: 'D' },
  ], tags: ['Algorithm', 'Sorting'] },
  { question: 'Which protocol does HTTPS use for encryption?', referenceAnswer: 'TLS/SSL', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'AES', value: 'A' }, { label: 'RSA', value: 'B' }, { label: 'TLS/SSL', value: 'C', isCorrect: true }, { label: 'SHA-256', value: 'D' },
  ], tags: ['Security', 'HTTP'] },
  { question: 'What is the default port for MySQL?', referenceAnswer: '3306', categoryName: '数据库', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: '5432', value: 'A' }, { label: '3306', value: 'B', isCorrect: true }, { label: '27017', value: 'C' }, { label: '6379', value: 'D' },
  ], tags: ['MySQL', 'Basics'] },
  { question: 'Which design pattern ensures only one instance of a class?', referenceAnswer: 'Singleton', categoryName: '技术面试', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.CHOICE, options: [
    { label: 'Factory', value: 'A' }, { label: 'Observer', value: 'B' }, { label: 'Singleton', value: 'C', isCorrect: true }, { label: 'Strategy', value: 'D' },
  ], tags: ['Design Pattern', 'OOP'] },

  // ==================== Judgment Questions ====================
  { question: 'TCP is a connection-oriented protocol.', referenceAnswer: 'True', categoryName: '计算机网络', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: 'True', value: 'true', isCorrect: true }, { label: 'False', value: 'false' },
  ], tags: ['TCP', 'Basics'] },
  { question: 'In JavaScript, null === undefined evaluates to true.', referenceAnswer: 'False', categoryName: '技术面试', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: 'True', value: 'true' }, { label: 'False', value: 'false', isCorrect: true },
  ], tags: ['JavaScript', 'Basics'] },
  { question: 'A deadlock requires at least 4 conditions to occur simultaneously.', referenceAnswer: 'True', categoryName: '操作系统', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: 'True', value: 'true', isCorrect: true }, { label: 'False', value: 'false' },
  ], tags: ['Deadlock', 'OS'] },
  { question: 'Redis is a single-threaded database, so it cannot handle concurrent requests.', referenceAnswer: 'False', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: 'True', value: 'true' }, { label: 'False', value: 'false', isCorrect: true },
  ], tags: ['Redis', 'Concurrency'] },
  { question: 'HTTP/2 supports multiplexing multiple requests over a single TCP connection.', referenceAnswer: 'True', categoryName: '计算机网络', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: 'True', value: 'true', isCorrect: true }, { label: 'False', value: 'false' },
  ], tags: ['HTTP/2', 'Network'] },
  { question: 'In a B+ tree index, all leaf nodes are linked together.', referenceAnswer: 'True', categoryName: '数据库', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: 'True', value: 'true', isCorrect: true }, { label: 'False', value: 'false' },
  ], tags: ['B+ Tree', 'Index'] },
  { question: 'The time complexity of HashMap get() operation is always O(1).', referenceAnswer: 'False', categoryName: '技术面试', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: 'True', value: 'true' }, { label: 'False', value: 'false', isCorrect: true },
  ], tags: ['HashMap', 'Data Structure'] },
  { question: 'Virtual memory allows a process to use more memory than physically available.', referenceAnswer: 'True', categoryName: '操作系统', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: 'True', value: 'true', isCorrect: true }, { label: 'False', value: 'false' },
  ], tags: ['Virtual Memory', 'OS'] },
  { question: 'In SQL, INNER JOIN returns rows even when there is no match in one table.', referenceAnswer: 'False', categoryName: '数据库', difficulty: QuestionDifficulty.EASY, questionType: QuestionType.JUDGMENT, options: [
    { label: 'True', value: 'true' }, { label: 'False', value: 'false', isCorrect: true },
  ], tags: ['SQL', 'JOIN'] },
  { question: 'Microservices architecture always performs better than monolithic architecture.', referenceAnswer: 'False', categoryName: '系统设计', difficulty: QuestionDifficulty.MEDIUM, questionType: QuestionType.JUDGMENT, options: [
    { label: 'True', value: 'true' }, { label: 'False', value: 'false', isCorrect: true },
  ], tags: ['Architecture', 'Microservices'] },
];
