// ============================================================================
// DSA Mastery - Smart Flashcards Dataset
// Flashcards for spaced repetition (SM-2 Algorithm)
// ============================================================================

export interface Flashcard {
  id: number;
  unit: number;
  topic: string;
  front: string;
  back: string;
  category: string;
}

export const FLASHCARDS: Flashcard[] = [
  // Unit 1
  {
    id: 1,
    unit: 1,
    topic: 'Primitive Types',
    category: 'Memory & Types',
    front: 'What does the sizeof operator return in C, and what is its return type?',
    back: 'sizeof returns the size of a variable or data type in bytes as an unsigned integer of type size_t.'
  },
  {
    id: 2,
    unit: 1,
    topic: 'Structure Padding',
    category: 'Structures',
    front: 'What is structure padding in C and why does the compiler add it?',
    back: 'Compilers add unused padding bytes between struct members to align multi-byte data on naturally divisible memory address boundaries, ensuring fast single-cycle CPU word access.'
  },
  {
    id: 3,
    unit: 1,
    topic: 'Dynamic Memory',
    category: 'Memory',
    front: 'What is the key difference between malloc() and calloc()?',
    back: 'malloc(size) allocates uninitialized memory containing garbage values; calloc(n, size) allocates memory and initializes all bytes to zero.'
  },
  {
    id: 4,
    unit: 1,
    topic: 'Asymptotic Notations',
    category: 'Complexity',
    front: 'What is the formal mathematical definition of Big-O notation?',
    back: 'f(n) = O(g(n)) if there exist positive constants c and n0 such that 0 <= f(n) <= c * g(n) for all n >= n0. It represents the asymptotic upper bound.'
  },

  // Unit 2
  {
    id: 5,
    unit: 2,
    topic: 'Linked Lists',
    category: 'List Structures',
    front: 'What is the time complexity to insert a new node at the beginning of a singly linked list?',
    back: 'O(1) constant time because it only requires updating two pointer assignments (newNode->next = head and head = newNode).'
  },
  {
    id: 6,
    unit: 2,
    topic: 'Doubly Linked List',
    category: 'List Structures',
    front: 'Why is deleting a node O(1) in a Doubly Linked List when given a direct pointer to that node?',
    back: 'Because the node stores direct pointers to both its predecessor (prev) and successor (next), allowing immediate relinking without traversing from the head.'
  },
  {
    id: 7,
    unit: 2,
    topic: 'Circular Linked List',
    category: 'List Structures',
    front: 'How is the end of a circular linked list detected during traversal?',
    back: 'Instead of checking for NULL, traversal terminates when a node\'s next pointer references the starting node (head) again: curr->next == head.'
  },
  {
    id: 8,
    unit: 2,
    topic: 'Sparse Matrix',
    category: 'Applications',
    front: 'What three pieces of data are stored for each non-zero element in a 3-tuple sparse matrix representation?',
    back: '1. Row index\n2. Column index\n3. Non-zero value'
  },

  // Unit 3
  {
    id: 9,
    unit: 3,
    topic: 'Stack ADT',
    category: 'Stacks',
    front: 'What happens during Stack Overflow and Stack Underflow?',
    back: 'Stack Overflow occurs when an attempt is made to push onto a full stack (top == MAX-1). Stack Underflow occurs when an attempt is made to pop from an empty stack (top == -1).'
  },
  {
    id: 10,
    unit: 3,
    topic: 'Expression Translation',
    category: 'Stacks',
    front: 'What is the postfix equivalent of: A + B * C - D / E?',
    back: 'A B C * + D E / -'
  },
  {
    id: 11,
    unit: 3,
    topic: 'Circular Queue',
    category: 'Queues',
    front: 'What are the enqueue and dequeue pointer update formulas for a Circular Queue of size MAX?',
    back: 'Enqueue: rear = (rear + 1) % MAX\nDequeue: front = (front + 1) % MAX'
  },
  {
    id: 12,
    unit: 3,
    topic: 'Deque',
    category: 'Queues',
    front: 'What is an Output-Restricted Deque?',
    back: 'A double-ended queue where deletion is restricted to only one end (front), while insertion is allowed at both ends (front and rear).'
  },

  // Unit 4
  {
    id: 13,
    unit: 4,
    topic: 'Binary Search Tree',
    category: 'Trees',
    front: 'What traversal of a Binary Search Tree produces elements in sorted ascending order?',
    back: 'Inorder Traversal (Left -> Root -> Right).'
  },
  {
    id: 14,
    unit: 4,
    topic: 'AVL Trees',
    category: 'Trees',
    front: 'What rotation is required for an LR imbalance in an AVL tree?',
    back: 'A double rotation: Left rotation on the left child, followed by a Right rotation on the unbalanced parent node.'
  },
  {
    id: 15,
    unit: 4,
    topic: 'Binary Heap',
    category: 'Heaps',
    front: 'In a 1-indexed binary heap array, what are the parent, left child, and right child formulas for node i?',
    back: 'Parent: floor(i / 2)\nLeft Child: 2 * i\nRight Child: 2 * i + 1'
  },
  {
    id: 16,
    unit: 4,
    topic: 'Separate Chaining',
    category: 'Hashing',
    front: 'What is the Load Factor (alpha) in a hash table and what does it indicate?',
    back: 'Load Factor alpha = N / M, where N is the number of stored keys and M is table capacity. It indicates the average length of collision chains in separate chaining.'
  },

  // Unit 5
  {
    id: 17,
    unit: 5,
    topic: 'Graph Traversals',
    category: 'Graphs',
    front: 'What data structure is used for Breadth-First Search vs Depth-First Search?',
    back: 'BFS uses a FIFO Queue (layer-by-layer exploration). DFS uses a LIFO Stack or recursion (deep branch exploration).'
  },
  {
    id: 18,
    unit: 5,
    topic: 'Minimum Spanning Tree',
    category: 'Graphs',
    front: 'How does Prim\'s algorithm differ fundamentally from Kruskal\'s algorithm?',
    back: 'Prim\'s is vertex-centric and grows a single continuous tree from a start node. Kruskal\'s is edge-centric, sorts all edges by weight, and joins disjoint forest components using Union-Find.'
  },
  {
    id: 19,
    unit: 5,
    topic: 'Dijkstra\'s Algorithm',
    category: 'Graphs',
    front: 'Why does Dijkstra\'s algorithm fail on graphs with negative edge weights?',
    back: 'Dijkstra permanently marks a vertex as visited (shortest distance locked) once extracted from the priority queue. A subsequent negative edge could create a shorter path to a locked vertex, which Dijkstra cannot retroactively update.'
  },
  {
    id: 20,
    unit: 5,
    topic: 'Topological Sort',
    category: 'Graphs',
    front: 'What is the condition for a graph to have at least one topological sort?',
    back: 'The graph must be a Directed Acyclic Graph (DAG) with no directed cycles.'
  }
];
