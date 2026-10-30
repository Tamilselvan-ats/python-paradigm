// ============================================================================
// SRM University / Anna University Exam Master Question Bank
// Real university exam format with 2, 5, 7, 10, 13, and 16 marks questions
// ============================================================================

export interface ExamQuestion {
  id: string;
  unit: number;
  marks: 2 | 5 | 7 | 10 | 13 | 16;
  topic: string;
  question: string;
  modelAnswer: string;
  keyPoints: string[];
}

export const EXAM_QUESTIONS: ExamQuestion[] = [
  // ── 2 Marks (Part A) ────────────────────────────────────────────────────────
  {
    id: 'eq-2-1',
    unit: 1,
    marks: 2,
    topic: 'Abstract Data Types',
    question: 'Define Abstract Data Type (ADT) with an example.',
    modelAnswer: 'An Abstract Data Type (ADT) is a mathematical specification of a set of data objects and the operations that can be performed on them, completely independent of any programming language or physical memory implementation. For example, the List ADT defines operations such as insert, delete, and find without specifying whether it uses a contiguous array or a linked list.',
    keyPoints: ['Definition of ADT', 'Separation of interface from implementation', 'Valid example (List, Stack, Queue)']
  },
  {
    id: 'eq-2-2',
    unit: 1,
    marks: 2,
    topic: 'Asymptotic Notations',
    question: 'Differentiate between Big-O and Big-Omega notations.',
    modelAnswer: 'Big-O notation describes an asymptotic upper bound on the growth rate of an algorithm (representing the worst-case scenario: f(n) <= c * g(n)). Big-Omega notation describes an asymptotic lower bound on the growth rate (representing the best-case performance threshold: f(n) >= c * g(n)).',
    keyPoints: ['Big-O is upper bound / worst case', 'Big-Omega is lower bound / best case', 'Mathematical condition for constants c and n0']
  },
  {
    id: 'eq-2-3',
    unit: 2,
    marks: 2,
    topic: 'Doubly Linked List',
    question: 'State one primary advantage and disadvantage of a Doubly Linked List over a Singly Linked List.',
    modelAnswer: 'Advantage: Bidirectional traversal is possible and deletion of a node takes O(1) time when the node pointer is known. Disadvantage: Requires extra memory per node for the previous pointer (8 additional bytes on 64-bit systems) and more pointer manipulation overhead during insertion and deletion.',
    keyPoints: ['Advantage: bidirectional traversal / O(1) deletion', 'Disadvantage: extra pointer memory / manipulation overhead']
  },
  {
    id: 'eq-2-4',
    unit: 3,
    marks: 2,
    topic: 'Circular Queue',
    question: 'How does a Circular Queue overcome the limitation of a Linear Queue?',
    modelAnswer: 'A linear queue suffers from "false overflow": when rear reaches the maximum index, no further elements can be enqueued even if elements have been dequeued from the front. A circular queue uses modulo arithmetic (rear = (rear + 1) % MAX) to wrap pointers around, reusing previously freed front positions.',
    keyPoints: ['Linear queue false overflow explanation', 'Modulo arithmetic wrap-around', 'Efficient memory utilization']
  },
  {
    id: 'eq-2-5',
    unit: 4,
    marks: 2,
    topic: 'AVL Trees',
    question: 'What is the balance factor of an AVL tree node and what is its valid range?',
    modelAnswer: 'The balance factor (BF) of a node is defined as the height of its left subtree minus the height of its right subtree: BF = height(left) - height(right). In a valid AVL tree, the balance factor of every node must be strictly in the set {-1, 0, +1}. If |BF| > 1, balancing rotations are required.',
    keyPoints: ['Formula: BF = height(left) - height(right)', 'Allowed values: -1, 0, +1']
  },
  {
    id: 'eq-2-6',
    unit: 5,
    marks: 2,
    topic: 'Topological Sort',
    question: 'Why can topological sorting not be applied to a cyclic graph?',
    modelAnswer: 'Topological sorting requires a linear ordering where for every directed edge u -> v, vertex u appears before v. In a cyclic graph (e.g., A -> B -> C -> A), A must precede B, B must precede C, and C must precede A, creating an irreconcilable circular dependency contradiction.',
    keyPoints: ['Definition of linear ordering constraint', 'Circular dependency contradiction in cycles', 'Applies only to DAGs']
  },

  // ── 5 Marks (Short Theory / Tracing) ────────────────────────────────────────
  {
    id: 'eq-5-1',
    unit: 1,
    marks: 5,
    topic: 'Dynamic Memory Allocation',
    question: 'Explain the functions malloc(), calloc(), realloc(), and free() in C with syntax.',
    modelAnswer: '1. malloc(size): Allocates a single block of uninitialized memory of given size in bytes. Returns void*.\n   Syntax: int *p = (int*)malloc(n * sizeof(int));\n\n2. calloc(n, size): Allocates memory for an array of n elements, each of specified byte size, and initializes all bytes to zero.\n   Syntax: int *p = (int*)calloc(n, sizeof(int));\n\n3. realloc(ptr, new_size): Resizes an existing dynamically allocated memory block, preserving existing content up to the minimum of old and new sizes.\n   Syntax: p = (int*)realloc(p, new_n * sizeof(int));\n\n4. free(ptr): Releases allocated heap memory back to the operating system runtime.\n   Syntax: free(p); p = NULL;',
    keyPoints: ['malloc syntax and uninitialized nature', 'calloc syntax and zero-initialization', 'realloc syntax and reallocation behavior', 'free syntax and dangling pointer avoidance']
  },
  {
    id: 'eq-5-2',
    unit: 3,
    marks: 5,
    topic: 'Infix to Postfix',
    question: 'Trace the conversion of the infix expression (A + B) * (C - D) / E to postfix notation using a stack.',
    modelAnswer: 'Expression: (A + B) * (C - D) / E\n\nStep-by-step trace:\n1. \'(\' -> Stack: [\'(\'], Output: ""\n2. \'A\' -> Stack: [\'(\'], Output: "A"\n3. \'+\' -> Stack: [\'(\', \'+\'], Output: "A"\n4. \'B\' -> Stack: [\'(\', \'+\'], Output: "A B"\n5. \')\' -> Pop until \'(\': Stack: [], Output: "A B +"\n6. \'*\' -> Stack: [\'*\'], Output: "A B +"\n7. \'(\' -> Stack: [\'*\', \'(\'], Output: "A B +"\n8. \'C\' -> Stack: [\'*\', \'(\'], Output: "A B + C"\n9. \'-\' -> Stack: [\'*\', \'(\', \'-\'], Output: "A B + C"\n10. \'D\' -> Stack: [\'*\', \'(\', \'-\'], Output: "A B + C D"\n11. \')\' -> Pop until \'(\': Stack: [\'*\'], Output: "A B + C D -"\n12. \'/\' -> Precedence of \'/\' == \'*\', pop \'*\', push \'/\': Stack: [\'/\'], Output: "A B + C D - *"\n13. \'E\' -> Stack: [\'/\'], Output: "A B + C D - * E"\n14. End of expression: Pop \'/\' -> Final Output: A B + C D - * E /',
    keyPoints: ['Correct stack contents at each step', 'Proper handling of parentheses', 'Operator precedence rule evaluation', 'Final expression: A B + C D - * E /']
  },

  // ── 7 Marks (Medium Design & Proofs) ────────────────────────────────────────
  {
    id: 'eq-7-1',
    unit: 2,
    marks: 7,
    topic: 'Polynomial Arithmetic',
    question: 'Write an algorithm and C structure definition to add two polynomials represented using singly linked lists.',
    modelAnswer: 'Structure Definition:\n```c\nstruct PolyNode {\n    int coeff;\n    int exp;\n    struct PolyNode *next;\n};\n```\n\nAlgorithm for PolyAdd(P1, P2):\n1. Initialize result pointer P3 = NULL, last = NULL.\n2. While P1 != NULL and P2 != NULL:\n   a. If P1->exp == P2->exp:\n      sum = P1->coeff + P2->coeff;\n      if sum != 0, attach node with coeff = sum, exp = P1->exp to P3;\n      advance P1 = P1->next, P2 = P2->next;\n   b. Else if P1->exp > P2->exp:\n      attach node with coeff = P1->coeff, exp = P1->exp to P3;\n      advance P1 = P1->next;\n   c. Else:\n      attach node with coeff = P2->coeff, exp = P2->exp to P3;\n      advance P2 = P2->next;\n3. Append any remaining nodes from P1 or P2 to P3.\n4. Return P3.\n\nTime Complexity: O(M + N) where M and N are the number of terms in P1 and P2.',
    keyPoints: ['Correct PolyNode struct definition', 'Three-way exponent comparison', 'Remaining term copying logic', 'Time complexity stated as O(M+N)']
  },

  // ── 10 Marks (Long Technical Questions) ─────────────────────────────────────
  {
    id: 'eq-10-1',
    unit: 4,
    marks: 10,
    topic: 'AVL Rotations',
    question: 'Explain the four rotation cases (LL, RR, LR, RL) in an AVL tree with diagrams and write the C function for Right Rotation.',
    modelAnswer: 'When an insertion violates the AVL balance condition (|BF| > 1), four distinct rotation cases can occur:\n\n1. Left-Left (LL) Case:\n- Insertion into left subtree of left child.\n- Node balance factor becomes +2 with left child BF >= 0.\n- Solution: Single Right Rotation on the unbalanced node.\n\n2. Right-Right (RR) Case:\n- Insertion into right subtree of right child.\n- Node balance factor becomes -2 with right child BF <= 0.\n- Solution: Single Left Rotation on the unbalanced node.\n\n3. Left-Right (LR) Case:\n- Insertion into right subtree of left child.\n- Node balance factor becomes +2 with left child BF = -1.\n- Solution: Double rotation: Left rotate left child, then Right rotate unbalanced parent.\n\n4. Right-Left (RL) Case:\n- Insertion into left subtree of right child.\n- Node balance factor becomes -2 with right child BF = +1.\n- Solution: Double rotation: Right rotate right child, then Left rotate unbalanced parent.\n\nC Function for Right Rotation:\n```c\nstruct AVLNode* rightRotate(struct AVLNode *y) {\n    struct AVLNode *x = y->left;\n    struct AVLNode *T2 = x->right;\n    \n    // Perform rotation\n    x->right = y;\n    y->left = T2;\n    \n    // Update heights\n    y->height = max(height(y->left), height(y->right)) + 1;\n    x->height = max(height(x->left), height(x->right)) + 1;\n    \n    return x; // New root of subtree\n}\n```',
    keyPoints: ['Definition and trigger for all 4 rotation cases', 'Distinction between single and double rotations', 'Accurate C code for rotation pointer reassignment', 'Height recalculation step']
  },

  // ── 13 Marks (Anna University Part B Standard) ──────────────────────────────
  {
    id: 'eq-13-1',
    unit: 5,
    marks: 13,
    topic: 'Dijkstra\'s Algorithm',
    question: 'Describe Dijkstra\'s Shortest Path algorithm with an example graph, step-by-step trace table, and complete C implementation.',
    modelAnswer: 'Dijkstra\'s algorithm finds the shortest path from a single source vertex to all other vertices in a directed or undirected graph with non-negative edge weights.\n\nAlgorithm:\n1. Initialize dist[src] = 0, dist[v] = INF for all v != src. Initialize visited[] = false.\n2. Repeat V-1 times:\n   a. Choose unvisited vertex u with minimum dist[u].\n   b. Mark visited[u] = true.\n   c. For every unvisited neighbor v of u:\n      If dist[u] + weight(u, v) < dist[v]:\n         dist[v] = dist[u] + weight(u, v)\n\nC Implementation:\n```c\n#include <stdio.h>\n#include <stdbool.h>\n#define V 5\n#define INF 999999\n\nint minDistance(int dist[], bool visited[]) {\n    int min = INF, min_idx = -1;\n    for (int v = 0; v < V; v++) {\n        if (!visited[v] && dist[v] <= min) {\n            min = dist[v]; min_idx = v;\n        }\n    }\n    return min_idx;\n}\n\nvoid dijkstra(int graph[V][V], int src) {\n    int dist[V];\n    bool visited[V] = {false};\n    for (int i = 0; i < V; i++) dist[i] = INF;\n    dist[src] = 0;\n    \n    for (int count = 0; count < V - 1; count++) {\n        int u = minDistance(dist, visited);\n        if (u == -1) break;\n        visited[u] = true;\n        for (int v = 0; v < V; v++) {\n            if (!visited[v] && graph[u][v] && dist[u] != INF \n                && dist[u] + graph[u][v] < dist[v]) {\n                dist[v] = dist[u] + graph[u][v];\n            }\n        }\n    }\n    printf("Vertex\\tDistance from Source\\n");\n    for (int i = 0; i < V; i++) printf("%d\\t%d\\n", i, dist[i]);\n}\n```\n\nComplexity: O(V^2) with adjacency matrix, O((V+E) log V) with min-heap.',
    keyPoints: ['Greedy choice property explanation', 'Edge relaxation formula', 'Complete compilable C code', 'Time and space complexity derivation']
  },

  // ── 16 Marks (Comprehensive University Problem) ─────────────────────────────
  {
    id: 'eq-16-1',
    unit: 4,
    marks: 16,
    topic: 'Binary Search Tree & Traversals',
    question: 'Discuss in detail the construction of a Binary Search Tree (BST). Provide C functions for insertion, recursive deletion handling all three cases, and all four traversal methods (Inorder, Preorder, Postorder, Level-Order).',
    modelAnswer: 'A Binary Search Tree is a binary tree with the property that for every node X, all keys in left(X) < key(X) and all keys in right(X) > key(X).\n\n1. Insertion: Traverses recursively down the tree to attach the new leaf node.\n2. Deletion Cases:\n   - Case 1: Node is a leaf: Simply free the node and return NULL.\n   - Case 2: Node has one child: Return the child to bypass the deleted node.\n   - Case 3: Node has two children: Find the Inorder Successor (minimum value in right subtree), copy its value into current node, and recursively delete the successor node from the right subtree.\n\nComplete C Implementation:\n```c\n#include <stdio.h>\n#include <stdlib.h>\n\nstruct Node {\n    int key;\n    struct Node *left, *right;\n};\n\nstruct Node* minValueNode(struct Node* node) {\n    struct Node* current = node;\n    while (current && current->left != NULL) current = current->left;\n    return current;\n}\n\nstruct Node* insert(struct Node* node, int key) {\n    if (node == NULL) {\n        struct Node* temp = (struct Node*)malloc(sizeof(struct Node));\n        temp->key = key; temp->left = temp->right = NULL;\n        return temp;\n    }\n    if (key < node->key) node->left = insert(node->left, key);\n    else if (key > node->key) node->right = insert(node->right, key);\n    return node;\n}\n\nstruct Node* deleteNode(struct Node* root, int key) {\n    if (root == NULL) return root;\n    if (key < root->key) root->left = deleteNode(root->left, key);\n    else if (key > root->key) root->right = deleteNode(root->right, key);\n    else {\n        // Case 1 & 2: One or zero children\n        if (root->left == NULL) {\n            struct Node* temp = root->right; free(root); return temp;\n        } else if (root->right == NULL) {\n            struct Node* temp = root->left; free(root); return temp;\n        }\n        // Case 3: Two children\n        struct Node* temp = minValueNode(root->right);\n        root->key = temp->key;\n        root->right = deleteNode(root->right, temp->key);\n    }\n    return root;\n}\n\nvoid inorder(struct Node* root) {\n    if (root) { inorder(root->left); printf("%d ", root->key); inorder(root->right); }\n}\nvoid preorder(struct Node* root) {\n    if (root) { printf("%d ", root->key); preorder(root->left); preorder(root->right); }\n}\nvoid postorder(struct Node* root) {\n    if (root) { postorder(root->left); postorder(root->right); printf("%d ", root->key); }\n}\n```\n\nComplexity Analysis: Search/Insert/Delete runs in average O(log N) and worst case O(N) when skewed.',
    keyPoints: ['Detailed explanation of BST invariant', 'Rigorous treatment of deletion Case 1, Case 2, Case 3', 'Clean compilable C implementation', 'All traversal implementations and complexity analysis']
  }
];
