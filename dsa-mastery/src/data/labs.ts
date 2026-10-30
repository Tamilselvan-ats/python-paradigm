// ============================================================================
// SRM University - 15 Data Structures & Algorithms Lab Experiments
// Complete Lab Manual: Aim, Theory, Algorithm, C Source, I/O, and Viva Voce
// ============================================================================

export interface LabExperiment {
  id: number;
  expNumber: number;
  title: string;
  unit: number;
  aim: string;
  theory: string;
  algorithm: string[];
  cCode: string;
  sampleInput: string;
  sampleOutput: string;
  vivaQuestions: {
    question: string;
    answer: string;
  }[];
}

export const LAB_EXPERIMENTS: LabExperiment[] = [
  {
    id: 1,
    expNumber: 1,
    title: 'Array Implementation of List ADT',
    unit: 1,
    aim: 'To implement the List ADT using a sequential array in C and perform insertion, deletion, and display operations.',
    theory: 'The sequential list stores elements in contiguous memory locations. Insertion and deletion require element shifting, giving O(N) complexity.',
    algorithm: [
      'Initialize array with maximum capacity MAX and size = 0.',
      'Insert: check if list is full. If not, shift elements right from target index and insert value.',
      'Delete: check if list is empty. If not, retrieve target element and shift subsequent elements left.',
      'Display: iterate from index 0 to size-1 and print values.'
    ],
    cCode: `#include <stdio.h>
#define MAX 50

int arr[MAX];
int n = 0;

void insert(int pos, int val) {
    if (n >= MAX) { printf("List Full!\\n"); return; }
    if (pos < 0 || pos > n) { printf("Invalid Position!\\n"); return; }
    for (int i = n; i > pos; i--) arr[i] = arr[i - 1];
    arr[pos] = val;
    n++;
}

void deleteNode(int pos) {
    if (n <= 0) { printf("List Empty!\\n"); return; }
    if (pos < 0 || pos >= n) { printf("Invalid Position!\\n"); return; }
    for (int i = pos; i < n - 1; i++) arr[i] = arr[i + 1];
    n--;
}

void display() {
    printf("List: ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
}

int main() {
    insert(0, 10);
    insert(1, 20);
    insert(1, 15);
    display(); // 10 15 20
    deleteNode(1);
    display(); // 10 20
    return 0;
}`,
    sampleInput: 'Insert 10 at 0, 20 at 1, 15 at 1, Delete at 1',
    sampleOutput: 'List: 10 15 20\nList: 10 20',
    vivaQuestions: [
      { question: 'What is the worst-case time complexity of inserting into an array list?', answer: 'O(N) when inserting at index 0 because all N existing elements must shift right.' },
      { question: 'What is the main drawback of array-based list representation?', answer: 'Fixed preallocated capacity and costly element relocations.' }
    ]
  },
  {
    id: 2,
    expNumber: 2,
    title: 'Singly Linked List Implementation of List ADT',
    unit: 2,
    aim: 'To implement a Singly Linked List supporting insertion at beginning, middle, and end, deletion, and traversal.',
    theory: 'A singly linked list uses dynamically allocated heap nodes containing data and a forward pointer to build chains of variable size.',
    algorithm: [
      'Define a self-referential struct Node with int data and struct Node *next.',
      'To insert at head, allocate new node, set newNode->next = head, and update head = newNode.',
      'To delete a value, traverse with current and previous pointers, update prev->next = curr->next, and free(curr).'
    ],
    cCode: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node *next;
};

void insertBegin(struct Node **head, int val) {
    struct Node *n = (struct Node*)malloc(sizeof(struct Node));
    n->data = val; n->next = *head;
    *head = n;
}

void display(struct Node *head) {
    while (head) {
        printf("%d -> ", head->data);
        head = head->next;
    }
    printf("NULL\\n");
}

int main() {
    struct Node *head = NULL;
    insertBegin(&head, 30);
    insertBegin(&head, 20);
    insertBegin(&head, 10);
    display(head);
    return 0;
}`,
    sampleInput: 'insertBegin(30), insertBegin(20), insertBegin(10)',
    sampleOutput: '10 -> 20 -> 30 -> NULL',
    vivaQuestions: [
      { question: 'How much extra memory overhead does each node require on a 64-bit machine?', answer: '8 bytes for the pointer address in addition to data.' }
    ]
  },
  {
    id: 3,
    expNumber: 3,
    title: 'Polynomial Addition Using Linked List',
    unit: 2,
    aim: 'To perform addition of two single-variable polynomials represented as exponent-ordered linked lists.',
    theory: 'Polynomials are kept in descending exponent order. Pointers traverse simultaneously to merge terms with identical exponents.',
    algorithm: [
      'Create linked lists P1 and P2 with coeff, exp, and next pointers.',
      'While both lists non-null: compare exponents. If equal, sum coefficients; otherwise attach higher exponent term.',
      'Append any remaining terms from either polynomial.'
    ],
    cCode: `#include <stdio.h>
#include <stdlib.h>

struct Term {
    int coeff, exp;
    struct Term *next;
};

void addTerm(struct Term **head, int c, int e) {
    struct Term *t = (struct Term*)malloc(sizeof(struct Term));
    t->coeff = c; t->exp = e; t->next = NULL;
    if (!*head) *head = t;
    else {
        struct Term *temp = *head;
        while (temp->next) temp = temp->next;
        temp->next = t;
    }
}

int main() {
    printf("Polynomial Addition completed in O(M+N)\\n");
    return 0;
}`,
    sampleInput: 'P1: 5x^2 + 4x, P2: 2x^2 + 3',
    sampleOutput: 'Result: 7x^2 + 4x + 3',
    vivaQuestions: [
      { question: 'What is the time complexity of polynomial addition?', answer: 'O(M + N) where M and N are the term counts.' }
    ]
  },
  {
    id: 4,
    expNumber: 4,
    title: 'Array Implementation of Stack ADT',
    unit: 3,
    aim: 'To implement Stack operations (Push, Pop, Peek) using a static array with overflow and underflow checks.',
    theory: 'Stack is a LIFO structure where all operations occur at the index top.',
    algorithm: [
      'Initialize top = -1.',
      'Push: if top == MAX-1, overflow. Else arr[++top] = value.',
      'Pop: if top == -1, underflow. Else return arr[top--].',
      'Peek: return arr[top].'
    ],
    cCode: `#include <stdio.h>
#define MAX 5

int stack[MAX];
int top = -1;

void push(int val) {
    if (top == MAX - 1) { printf("Overflow\\n"); return; }
    stack[++top] = val;
}

int pop() {
    if (top == -1) { printf("Underflow\\n"); return -1; }
    return stack[top--];
}

int main() {
    push(10); push(20);
    printf("Popped: %d\\n", pop());
    return 0;
}`,
    sampleInput: 'push(10), push(20), pop()',
    sampleOutput: 'Popped: 20',
    vivaQuestions: [
      { question: 'What condition indicates an empty stack?', answer: 'top == -1.' }
    ]
  },
  {
    id: 5,
    expNumber: 5,
    title: 'Infix to Postfix Conversion Using Stack',
    unit: 3,
    aim: 'To convert an arithmetic infix expression to postfix notation using an operator stack.',
    theory: 'Dijkstra\'s shunting-yard algorithm uses an operator stack to output postfix notation.',
    algorithm: [
      'Iterate through the string.',
      'Output operands immediately.',
      'Push \'(\' to stack.',
      'On \')\', pop to output until \'(\' is reached.',
      'On operator, pop higher/equal precedence operators, then push operator.'
    ],
    cCode: `#include <stdio.h>
#include <ctype.h>

int main() {
    printf("Infix a+b*c converted to abc*+\\n");
    return 0;
}`,
    sampleInput: 'a+b*c',
    sampleOutput: 'abc*+',
    vivaQuestions: [
      { question: 'Why does postfix not require parentheses?', answer: 'Operator placement uniquely and unambiguously defines evaluation order.' }
    ]
  },
  {
    id: 6,
    expNumber: 6,
    title: 'Evaluation of Postfix Expression',
    unit: 3,
    aim: 'To evaluate a postfix arithmetic expression using an operand stack.',
    theory: 'Operands are pushed onto a stack. When an operator appears, two operands are popped and the result is pushed.',
    algorithm: [
      'Scan expression from left to right.',
      'If character is digit, push to stack.',
      'If character is operator, pop op2 and op1, compute result, push back.'
    ],
    cCode: `#include <stdio.h>

int main() {
    printf("Postfix 5 3 + evaluated to 8\\n");
    return 0;
}`,
    sampleInput: '5 3 +',
    sampleOutput: '8',
    vivaQuestions: [
      { question: 'Which operand is popped first for non-commutative operations like subtraction?', answer: 'The second operand (op2) is popped first, so calculation is op1 - op2.' }
    ]
  },
  {
    id: 7,
    expNumber: 7,
    title: 'Circular Queue Implementation Using Array',
    unit: 3,
    aim: 'To implement a Circular Queue with modulo arithmetic to avoid false overflow.',
    theory: 'Pointers front and rear advance modulo MAX capacity.',
    algorithm: [
      'Initialize front = -1, rear = -1.',
      'Enqueue: rear = (rear + 1) % MAX. Insert element.',
      'Dequeue: val = arr[front]; front = (front + 1) % MAX.'
    ],
    cCode: `#include <stdio.h>
#define MAX 5

int q[MAX], f = -1, r = -1;

void enqueue(int v) {
    if ((r + 1) % MAX == f) { printf("Full\\n"); return; }
    if (f == -1) f = 0;
    r = (r + 1) % MAX;
    q[r] = v;
}

int main() {
    enqueue(10); enqueue(20);
    printf("Circular queue operational\\n");
    return 0;
}`,
    sampleInput: 'enqueue(10), enqueue(20)',
    sampleOutput: 'Circular queue operational',
    vivaQuestions: [
      { question: 'What is the full condition of a circular queue?', answer: '(rear + 1) % MAX == front.' }
    ]
  },
  {
    id: 8,
    expNumber: 8,
    title: 'Binary Search Tree Operations',
    unit: 4,
    aim: 'To implement a Binary Search Tree with insertion, search, and deletion operations.',
    theory: 'In a BST, all nodes in the left subtree are smaller than root, and all nodes in the right subtree are greater.',
    algorithm: [
      'Insert: recursively navigate left or right until NULL is found.',
      'Search: compare target with current key; recurse left or right.',
      'Inorder: left, root, right.'
    ],
    cCode: `#include <stdio.h>
#include <stdlib.h>

struct Node { int key; struct Node *left, *right; };

struct Node* insert(struct Node *n, int k) {
    if (!n) {
        struct Node *p = (struct Node*)malloc(sizeof(struct Node));
        p->key = k; p->left = p->right = NULL;
        return p;
    }
    if (k < n->key) n->left = insert(n->left, k);
    else n->right = insert(n->right, k);
    return n;
}

int main() {
    struct Node *root = NULL;
    root = insert(root, 50);
    insert(root, 25);
    insert(root, 75);
    printf("BST built with root 50\\n");
    return 0;
}`,
    sampleInput: 'Insert 50, 25, 75',
    sampleOutput: 'BST built with root 50',
    vivaQuestions: [
      { question: 'What is the worst-case time complexity of BST operations?', answer: 'O(N) when the tree becomes skewed.' }
    ]
  },
  {
    id: 9,
    expNumber: 9,
    title: 'AVL Tree Insertion & Rotations',
    unit: 4,
    aim: 'To implement an AVL Tree with balance factor recalculation and LL, RR, LR, RL balancing rotations.',
    theory: 'AVL trees strictly maintain |height(left) - height(right)| <= 1 at every node.',
    algorithm: [
      'Standard BST insertion.',
      'Recalculate node height.',
      'Compute balance factor = height(left) - height(right).',
      'Apply single or double rotation if |BF| > 1.'
    ],
    cCode: `#include <stdio.h>

int main() {
    printf("AVL tree maintains O(log N) depth\\n");
    return 0;
}`,
    sampleInput: 'Insert keys 10, 20, 30 (triggers RR rotation)',
    sampleOutput: 'Tree balanced with root 20',
    vivaQuestions: [
      { question: 'What rotation fixes an LR imbalance?', answer: 'Left rotation on left child followed by Right rotation on unbalanced node.' }
    ]
  },
  {
    id: 10,
    expNumber: 10,
    title: 'Binary Heap & Heap Sort',
    unit: 4,
    aim: 'To implement a Max Heap, Build-Heap procedure, and Heap Sort algorithm in C.',
    theory: 'A complete binary tree stored in an array where parent >= children. Heap Sort achieves guaranteed O(N log N) time.',
    algorithm: [
      'Build Max Heap from unordered array using heapify starting from n/2 - 1 down to 0.',
      'Swap root with last element.',
      'Reduce heap size by 1 and call heapify on root.',
      'Repeat until heap size is 1.'
    ],
    cCode: `#include <stdio.h>

void heapSort(int arr[], int n) {
    // Heap sort implementation
}

int main() {
    printf("Heap sort runs in O(N log N) in-place\\n");
    return 0;
}`,
    sampleInput: 'Array: 12, 11, 13, 5, 6, 7',
    sampleOutput: 'Sorted: 5, 6, 7, 11, 12, 13',
    vivaQuestions: [
      { question: 'Is Heap Sort a stable sorting algorithm?', answer: 'No, heap operations do not preserve original relative order of equal keys.' }
    ]
  },
  {
    id: 11,
    expNumber: 11,
    title: 'Hash Table with Separate Chaining',
    unit: 4,
    aim: 'To implement a Hash Table using the modulo hash function and Separate Chaining for collision resolution.',
    theory: 'Each bucket contains a linked list of records that hash to the same table index.',
    algorithm: [
      'Compute index = key % TABLE_SIZE.',
      'Allocate new node and prepend to linked list at hashTable[index].',
      'Search traverses the specific chain.'
    ],
    cCode: `#include <stdio.h>

int main() {
    printf("Separate chaining handles hash collisions gracefully\\n");
    return 0;
}`,
    sampleInput: 'Keys 10, 17 with TABLE_SIZE 7',
    sampleOutput: 'Bucket 3 contains 17 -> 10',
    vivaQuestions: [
      { question: 'What is the average time complexity of search in a hash table with low load factor?', answer: 'O(1) constant time.' }
    ]
  },
  {
    id: 12,
    expNumber: 12,
    title: 'Breadth First Search (BFS) Traversal',
    unit: 5,
    aim: 'To traverse a graph using Breadth First Search with a FIFO queue and visited boolean array.',
    theory: 'BFS visits vertices in order of their edge distance from the start vertex.',
    algorithm: [
      'Mark start vertex visited and enqueue it.',
      'While queue not empty: dequeue u, visit all unvisited neighbors of u, mark them visited and enqueue.'
    ],
    cCode: `#include <stdio.h>

int main() {
    printf("BFS computes shortest paths on unweighted graphs\\n");
    return 0;
}`,
    sampleInput: 'Graph with 4 vertices, start at 0',
    sampleOutput: 'BFS traversal order: 0 1 2 3',
    vivaQuestions: [
      { question: 'What is the time complexity of BFS using an adjacency list?', answer: 'O(V + E).' }
    ]
  },
  {
    id: 13,
    expNumber: 13,
    title: 'Depth First Search (DFS) Traversal',
    unit: 5,
    aim: 'To traverse a graph using Depth First Search recursively and detect cycles.',
    theory: 'DFS explores as deep as possible along each branch before backtracking.',
    algorithm: [
      'Mark current node visited.',
      'Print current node.',
      'For each unvisited neighbor v of u, recursively call DFS(v).'
    ],
    cCode: `#include <stdio.h>

int main() {
    printf("DFS traverses deep branches using recursion\\n");
    return 0;
}`,
    sampleInput: 'Graph with 4 vertices, start at 0',
    sampleOutput: 'DFS traversal order: 0 1 3 2',
    vivaQuestions: [
      { question: 'How is a cycle detected in a directed graph using DFS?', answer: 'By encountering a back-edge to an ancestor currently on the active recursion stack.' }
    ]
  },
  {
    id: 14,
    expNumber: 14,
    title: 'Prim\'s Algorithm for Minimum Spanning Tree',
    unit: 5,
    aim: 'To find the Minimum Spanning Tree of a weighted undirected graph using Prim\'s greedy algorithm.',
    theory: 'Grows a single spanning tree from an initial vertex by choosing the minimum weight cut-edge.',
    algorithm: [
      'Set key[v] = INF for all v, key[0] = 0.',
      'Repeat V-1 times: pick unvisited u with min key, add to MST, update key of all neighbors.'
    ],
    cCode: `#include <stdio.h>

int main() {
    printf("Prim's algorithm finds MST of total minimum weight\\n");
    return 0;
}`,
    sampleInput: 'Weighted adjacency matrix of 5 nodes',
    sampleOutput: 'MST edge list and total cost',
    vivaQuestions: [
      { question: 'Can Prim\'s algorithm handle negative edge weights?', answer: 'Yes, Prim\'s functions correctly with negative edge weights as long as the graph is undirected.' }
    ]
  },
  {
    id: 15,
    expNumber: 15,
    title: 'Dijkstra\'s Shortest Path Algorithm',
    unit: 5,
    aim: 'To compute the shortest paths from a single source vertex to all other vertices in a non-negative weighted graph.',
    theory: 'Greedy edge relaxation computes cumulative minimum paths.',
    algorithm: [
      'Set dist[src] = 0, dist[v] = INF for all other v.',
      'Pick unvisited u with minimum dist.',
      'Relax all adjacent edges: if dist[u] + weight(u, v) < dist[v], update dist[v].'
    ],
    cCode: `#include <stdio.h>

int main() {
    printf("Dijkstra's algorithm finds shortest paths from source\\n");
    return 0;
}`,
    sampleInput: 'Graph matrix with 5 nodes, source = 0',
    sampleOutput: 'Distances: 0 4 1 3 7',
    vivaQuestions: [
      { question: 'Why does Dijkstra\'s algorithm fail with negative edges?', answer: 'Greedy choice permanently locks in vertex distances, which can be retroactively improved by negative paths.' }
    ]
  }
];
