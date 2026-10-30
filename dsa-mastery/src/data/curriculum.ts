// ============================================================================
// SRM Institute of Science & Technology - Data Structures & Algorithms Syllabus
// Complete Curriculum Dataset: Units 1 to 5
// ============================================================================

export interface MCQQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CurriculumTopic {
  id: string;
  unitId: number;
  unitTitle: string;
  title: string;
  slug: string;
  description: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  category: string;
  realWorldAnalogy: string;
  keyPoints: string[];
  theory: string;
  cCode: string;
  visualizer?: string;
  mcqs: MCQQuestion[];
}

export interface UnitInfo {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  color: string;
  icon: string;
  topicsCount: number;
}

export const COURSE_UNITS: UnitInfo[] = [
  {
    id: 1,
    title: 'Unit 1: Introduction & Foundations',
    subtitle: 'C Basics, Structures, Memory & Asymptotic Analysis',
    description: 'Foundations of computer memory, primitive data types, structures, dynamic allocation, ADTs, and Big-O/Omega/Theta algorithmic complexity analysis.',
    badge: 'Foundation',
    color: 'from-blue-500 to-cyan-500',
    icon: '📚',
    topicsCount: 12,
  },
  {
    id: 2,
    title: 'Unit 2: Linear List Structures',
    subtitle: 'Array Lists, Cursor Lists, Singly/Doubly/Circular Lists',
    description: 'Sequential and linked implementations of lists, cursor-based storage, sparse matrices representation, polynomial arithmetic, and the Josephus circle problem.',
    badge: 'Linear Structures',
    color: 'from-emerald-500 to-teal-500',
    icon: '🔗',
    topicsCount: 9,
  },
  {
    id: 3,
    title: 'Unit 3: Stacks & Queues',
    subtitle: 'LIFO & FIFO Mechanics, Expression Parsing & Recursion',
    description: 'Stack primitives, infix-to-postfix translation, expression evaluation, bracket balancing, Tower of Hanoi, Queue architectures (circular, deque, priority queue).',
    badge: 'ADTs',
    color: 'from-purple-500 to-indigo-500',
    icon: '📦',
    topicsCount: 8,
  },
  {
    id: 4,
    title: 'Unit 4: Trees & Hashing',
    subtitle: 'Hierarchical Structures, AVL Balancing & Hash Maps',
    description: 'Tree traversals, Binary Search Trees (BST), self-balancing AVL trees with LL/RR/LR/RL rotations, B-Trees, Binary Heaps, and Hashing with Separate Chaining & Probing.',
    badge: 'Non-Linear',
    color: 'from-amber-500 to-orange-500',
    icon: '🌳',
    topicsCount: 10,
  },
  {
    id: 5,
    title: 'Unit 5: Graphs & Network Algorithms',
    subtitle: 'Graph Traversals, Minimum Spanning Trees & Shortest Paths',
    description: 'Graph representations (Adjacency Matrix/List), BFS, DFS, Topological Sorting (Kahn\'s algorithm), Prim\'s and Kruskal\'s MST, and Dijkstra\'s Single Source Shortest Path.',
    badge: 'Advanced Graphs',
    color: 'from-rose-500 to-pink-500',
    icon: '🕸️',
    topicsCount: 6,
  },
];

export const TOPICS: CurriculumTopic[] = [
  // ──────────────────────────────────────────────────────────────────────────
  // UNIT 1: Introduction
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'u1-primitive-types',
    unitId: 1,
    unitTitle: 'Introduction',
    title: 'Primitive Data Types',
    slug: 'primitive-data-types',
    category: 'Memory & Types',
    description: 'Fundamental building blocks in C: char, int, float, double, void, and their binary storage representations.',
    timeComplexity: 'O(1) Access',
    spaceComplexity: '1 to 8 Bytes',
    realWorldAnalogy: 'Atomic particles (protons, neutrons, electrons) from which all complex compounds are constructed.',
    keyPoints: [
      'Primitive types map directly to hardware registers and CPU word sizes.',
      'int is typically 4 bytes (32-bit signed two\'s complement: -2^31 to 2^31-1).',
      'IEEE 754 standard defines single (float, 32-bit) and double (double, 64-bit) precision floating point arithmetic.',
      'sizeof operator provides byte dimensions computed at compile-time.',
    ],
    theory: `### Primitive Data Types in C

In C, data types specify how the compiler interprets bit patterns in memory.

#### 1. Integer Types
- **char**: 1 byte (-128 to 127 or 0 to 255)
- **short**: 2 bytes (-32,768 to 32,767)
- **int**: 4 bytes on modern 32/64-bit systems (-2,147,483,648 to 2,147,483,647)
- **long**: 4 or 8 bytes depending on the data model (LLP64 vs LP64)

#### 2. Floating-Point Types (IEEE 754)
- **float**: 32-bit (1 sign bit, 8 exponent bits, 23 mantissa bits) -> ~6-7 decimal digits precision
- **double**: 64-bit (1 sign bit, 11 exponent bits, 52 mantissa bits) -> ~15-17 decimal digits precision

#### 3. Void Type
Represents absence of value or untyped memory (\`void*\`).`,
    cCode: `#include <stdio.h>

int main() {
    int a = 42;
    float b = 3.14159f;
    char c = 'Z';
    double d = 2.718281828459;

    printf("Size of int: %zu bytes (Value: %d)\\n", sizeof(a), a);
    printf("Size of float: %zu bytes (Value: %.2f)\\n", sizeof(b), b);
    printf("Size of char: %zu byte (Value: '%c', ASCII: %d)\\n", sizeof(c), c, c);
    printf("Size of double: %zu bytes (Value: %.6f)\\n", sizeof(d), d);

    return 0;
}`,
    mcqs: [
      {
        question: 'What is the format specifier for printing size_t returned by sizeof in standard C?',
        options: ['%d', '%ld', '%zu', '%u'],
        correctIndex: 2,
        explanation: '%zu is the C99 standard format specifier for size_t values returned by sizeof.',
      },
    ],
  },
  {
    id: 'u1-structures',
    unitId: 1,
    unitTitle: 'Introduction',
    title: 'Structures & Padding',
    slug: 'structures',
    category: 'Composite Types',
    description: 'User-defined composite types grouping heterogeneous variables, memory alignment, and structure padding.',
    timeComplexity: 'O(1) Member Access',
    spaceComplexity: 'Sum of member sizes + alignment padding',
    realWorldAnalogy: 'A student record folder containing name (string), roll number (int), and GPA (float).',
    keyPoints: [
      'Keyword \`struct\` bundles variables of different types under a unified identifier.',
      'Memory alignment requires variables to be stored at addresses divisible by their size.',
      'Padding bytes are inserted between fields to satisfy CPU alignment constraints.',
    ],
    theory: `### C Structures & Memory Alignment

A \`struct\` creates a record type containing heterogeneous fields stored contiguously in memory.

#### Structure Padding
Compilers align data members on natural word boundaries (e.g., 4-byte ints start on addresses divisible by 4) to ensure single-cycle memory fetches. This causes "padding" gaps.`,
    cCode: `#include <stdio.h>

struct Student {
    char id;       // 1 byte + 3 bytes padding
    int rollNo;    // 4 bytes
    float gpa;     // 4 bytes
};

int main() {
    struct Student s1 = {'A', 101, 3.85f};
    printf("Student ID: %c, Roll: %d, GPA: %.2f\\n", s1.id, s1.rollNo, s1.gpa);
    printf("Total struct size: %zu bytes (1+4+4 + 3 padding)\\n", sizeof(struct Student));
    return 0;
}`,
    mcqs: [
      {
        question: 'Why does a struct with char (1 byte) followed by int (4 bytes) typically occupy 8 bytes rather than 5?',
        options: [
          'Because char is expanded to 4 bytes',
          'Due to 3 padding bytes added for 4-byte memory boundary alignment',
          'Compiler error',
          'Because of pointer arithmetic',
        ],
        correctIndex: 1,
        explanation: 'Compilers insert 3 padding bytes after the 1-byte char so the 4-byte int starts at a 4-byte boundary.',
      },
    ],
  },
  {
    id: 'u1-self-referential',
    unitId: 1,
    unitTitle: 'Introduction',
    title: 'Self-Referential Structures',
    slug: 'self-referential-structures',
    category: 'Memory & Types',
    description: 'Structures containing pointers to their own type, forming the bedrock of Linked Lists, Trees, and Graphs.',
    timeComplexity: 'O(1) Link traversal',
    spaceComplexity: 'Node size + 8-byte pointer',
    realWorldAnalogy: 'A scavenger hunt where each clue contains instructions and the physical address of the next clue.',
    keyPoints: [
      'A struct cannot contain an instance of itself (infinite size error), but can contain a pointer to itself.',
      'Pointer size is fixed (8 bytes on 64-bit platforms), allowing the compiler to determine struct layout.',
      'Forms recursive data structures: lists (single link), trees (left/right links), graphs (adjacency links).',
    ],
    theory: `### Self-Referential Structures

A structure is self-referential if it contains a pointer member that references another structure of the same type.

\`\`\`c
struct Node {
    int data;
    struct Node *next; // Points to another struct Node
};
\`\`\`

Because \`next\` is a pointer, its size is known at compile time (typically 8 bytes on 64-bit architectures), resolving recursion.`,
    cCode: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node *next;
};

int main() {
    struct Node *first = (struct Node*)malloc(sizeof(struct Node));
    struct Node *second = (struct Node*)malloc(sizeof(struct Node));

    first->data = 10;
    first->next = second;

    second->data = 20;
    second->next = NULL;

    printf("Node 1: %d -> Node 2: %d -> NULL\\n", first->data, first->next->data);

    free(first);
    free(second);
    return 0;
}`,
    mcqs: [
      {
        question: 'Why must the self-referential member be a pointer rather than a direct struct member?',
        options: [
          'Pointers are faster than structs',
          'A struct containing itself directly would require infinite memory to define',
          'C does not allow structures with more than one field',
          'To prevent stack overflows',
        ],
        correctIndex: 1,
        explanation: 'Direct inclusion creates an infinite recursive definition, whereas a pointer has a fixed known size.',
      },
    ],
  },
  {
    id: 'u1-pointers-to-struct',
    unitId: 1,
    unitTitle: 'Introduction',
    title: 'Pointer To Structure',
    slug: 'pointer-to-structure',
    category: 'Pointers',
    description: 'Arrow operator (->), passing structs by reference, avoiding heavy struct copying on the call stack.',
    timeComplexity: 'O(1) Indirection',
    spaceComplexity: '8-byte pointer',
    realWorldAnalogy: 'A GPS coordinate pointing to a physical house rather than duplicating the entire house.',
    keyPoints: [
      'The arrow operator \`ptr->member\` is syntactic sugar for \`(*ptr).member\`.',
      'Passing structs by pointer (\`O(1)\` space/time) prevents copying large memory buffers onto the call stack.',
    ],
    theory: `### Pointer to Structure in C

When managing dynamic data structures, structs are accessed via pointer addresses returned by heap allocators.
Using \`ptr->member\` dereferences the pointer and accesses the designated offset.`,
    cCode: `#include <stdio.h>

struct Point {
    int x;
    int y;
};

void movePoint(struct Point *p, int dx, int dy) {
    p->x += dx; // Equivalent to (*p).x += dx
    p->y += dy;
}

int main() {
    struct Point pt = {10, 20};
    struct Point *ptr = &pt;

    printf("Original: (%d, %d)\\n", ptr->x, ptr->y);
    movePoint(ptr, 5, -10);
    printf("After Move: (%d, %d)\\n", ptr->x, ptr->y);
    return 0;
}`,
    mcqs: [
      {
        question: 'What is the equivalent expression to `ptr->data`?',
        options: ['*ptr.data', '(*ptr).data', '&ptr.data', 'ptr.*data'],
        correctIndex: 1,
        explanation: 'Because member access (.) has higher precedence than dereference (*), parentheses are required: (*ptr).data.',
      },
    ],
  },
  {
    id: 'u1-dma',
    unitId: 1,
    unitTitle: 'Introduction',
    title: 'Dynamic Memory Allocation (DMA)',
    slug: 'dynamic-memory-allocation',
    category: 'Memory Management',
    description: 'Heap memory lifecycle using malloc, calloc, realloc, and free; memory leak prevention and dangling pointer safety.',
    timeComplexity: 'O(1) to O(N) for realloc',
    spaceComplexity: 'Explicit Heap Allocation',
    realWorldAnalogy: 'Renting hotel rooms on-demand when guests arrive and checking them out immediately upon departure.',
    keyPoints: [
      'malloc(size): Allocates uninitialized memory buffer.',
      'calloc(num, size): Allocates memory zero-initialized.',
      'realloc(ptr, new_size): Resizes an existing heap allocation, migrating bytes if needed.',
      'free(ptr): Deallocates heap memory back to the OS runtime; always set pointer to NULL afterward.',
    ],
    theory: `### Dynamic Memory Allocation (DMA) in C

Stack memory is strictly bounded by function scope. Dynamic allocation allocates blocks on the heap that persist until freed explicitly.

#### Memory Leak
Occurs when heap memory is allocated but never freed, eventually exhausting address space.

#### Dangling Pointer
Occurs when memory is freed, but the pointer still holds the defunct address.`,
    cCode: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n = 5;
    int *arr = (int*)calloc(n, sizeof(int)); // Zero-initialized
    if (arr == NULL) {
        printf("Memory allocation failed!\\n");
        return 1;
    }

    for (int i = 0; i < n; i++) arr[i] = (i + 1) * 10;

    // Expand array to 8 elements
    int *temp = (int*)realloc(arr, 8 * sizeof(int));
    if (temp != NULL) {
        arr = temp;
        arr[5] = 60; arr[6] = 70; arr[7] = 80;
    }

    printf("Dynamic array: ");
    for (int i = 0; i < 8; i++) printf("%d ", arr[i]);
    printf("\\n");

    free(arr);
    arr = NULL; // Prevent dangling pointer
    return 0;
}`,
    visualizer: 'array',
    mcqs: [
      {
        question: 'What is the primary difference between malloc() and calloc()?',
        options: [
          'malloc is faster and initializes memory to zero',
          'calloc initializes allocated memory to all zeros; malloc leaves it uninitialized (garbage values)',
          'malloc operates on stack, calloc operates on heap',
          'calloc cannot be reallocated with realloc',
        ],
        correctIndex: 1,
        explanation: 'calloc clears the memory buffer to zero, whereas malloc contains whatever garbage data was previously in that address.',
      },
    ],
  },
  {
    id: 'u1-matrix-multiplication',
    unitId: 1,
    unitTitle: 'Introduction',
    title: 'Matrix Multiplication & DMA',
    slug: 'matrix-multiplication',
    category: 'Algorithms',
    description: '2D matrix multiplication using dynamic double pointers (int**), row-column dot products, and O(n^3) complexity.',
    timeComplexity: 'O(r1 * c1 * c2) -> O(N^3) for NxN',
    spaceComplexity: 'O(N^2) auxiliary heap memory',
    realWorldAnalogy: 'Transforming multidimensional coordinate points across 3D rendering engines and neural network weights.',
    keyPoints: [
      'Inner dimension match required: matrix A (r1 x c1) can multiply matrix B (r2 x c2) only if c1 == r2.',
      'Result matrix C has dimensions r1 x c2.',
      'Element C[i][j] = sum over k of A[i][k] * B[k][j].',
    ],
    theory: `### Matrix Multiplication

Matrix multiplication performs dot products of rows of A with columns of B:
$$C_{ij} = \\sum_{k=0}^{n-1} A_{ik} B_{kj}$$

Triple nested loops yield $O(N^3)$ operations in standard matrix multiplication.`,
    cCode: `#include <stdio.h>
#include <stdlib.h>

int** allocateMatrix(int r, int c) {
    int **m = (int**)malloc(r * sizeof(int*));
    for (int i = 0; i < r; i++) {
        m[i] = (int*)malloc(c * sizeof(int));
    }
    return m;
}

void freeMatrix(int **m, int r) {
    for (int i = 0; i < r; i++) free(m[i]);
    free(m);
}

int main() {
    int r1 = 2, c1 = 2, r2 = 2, c2 = 2;
    int **A = allocateMatrix(r1, c1);
    int **B = allocateMatrix(r2, c2);
    int **C = allocateMatrix(r1, c2);

    A[0][0] = 1; A[0][1] = 2;
    A[1][0] = 3; A[1][1] = 4;

    B[0][0] = 5; B[0][1] = 6;
    B[1][0] = 7; B[1][1] = 8;

    for (int i = 0; i < r1; i++) {
        for (int j = 0; j < c2; j++) {
            C[i][j] = 0;
            for (int k = 0; k < c1; k++) {
                C[i][j] += A[i][k] * B[k][j];
            }
        }
    }

    printf("Result matrix C:\\n%d %d\\n%d %d\\n", C[0][0], C[0][1], C[1][0], C[1][1]);

    freeMatrix(A, r1);
    freeMatrix(B, r2);
    freeMatrix(C, r1);
    return 0;
}`,
    visualizer: 'array',
    mcqs: [
      {
        question: 'What is the time complexity of multiplying two N x N square matrices using the standard 3-loop algorithm?',
        options: ['O(N)', 'O(N log N)', 'O(N^2)', 'O(N^3)'],
        correctIndex: 3,
        explanation: 'Three nested loops each iterating N times produce N * N * N = O(N^3) multiplications and additions.',
      },
    ],
  },
  {
    id: 'u1-adt',
    unitId: 1,
    unitTitle: 'Introduction',
    title: 'Abstract Data Types (ADT)',
    slug: 'abstract-data-types',
    category: 'Design Principles',
    description: 'Mathematical specification of data structures defining behavior (operations and contracts) independent of implementation.',
    timeComplexity: 'Contract Dependent',
    spaceComplexity: 'Contract Dependent',
    realWorldAnalogy: 'A car dashboard (steering, accelerator, brake) whose interface remains identical whether the engine is electric, hybrid, or petrol.',
    keyPoints: [
      'ADT defines WHAT operations can be performed, not HOW they are carried out.',
      'Encapsulation hides concrete internal storage from consumer code.',
      'Examples: List ADT, Stack ADT, Queue ADT, Tree ADT, Graph ADT.',
    ],
    theory: `### Abstract Data Types (ADT)

An Abstract Data Type is an abstraction that defines a set of values and operations.
The implementation details (arrays vs linked nodes) are hidden behind a public API.`,
    cCode: `#include <stdio.h>
#include <stdbool.h>

// Stack ADT Interface
typedef struct {
    int data[100];
    int top;
} StackADT;

void init(StackADT *s) { s->top = -1; }
bool isEmpty(StackADT *s) { return s->top == -1; }
void push(StackADT *s, int val) { s->data[++(s->top)] = val; }
int pop(StackADT *s) { return s->data[(s->top)--]; }

int main() {
    StackADT s;
    init(&s);
    push(&s, 42);
    push(&s, 99);
    printf("Popped: %d\\n", pop(&s));
    printf("Popped: %d\\n", pop(&s));
    return 0;
}`,
    mcqs: [
      {
        question: 'Which of the following describes an Abstract Data Type?',
        options: [
          'A specific C syntax header',
          'A data type defined solely by its behavior (operations) from the user perspective',
          'Only linked list implementations',
          'An algorithm with O(1) complexity',
        ],
        correctIndex: 1,
        explanation: 'An ADT is defined by the mathematical model and operations offered, regardless of how it is coded.',
      },
    ],
  },
  {
    id: 'u1-asymptotic-notations',
    unitId: 1,
    unitTitle: 'Introduction',
    title: 'Asymptotic Notations: Big O, Omega, Theta',
    slug: 'asymptotic-notations',
    category: 'Complexity Analysis',
    description: 'Mathematical bounds of growth: Big O (upper bound), Big Omega (lower bound), and Big Theta (tight bound).',
    timeComplexity: 'Theoretical Metric',
    spaceComplexity: 'Auxiliary Growth Metric',
    realWorldAnalogy: 'Delivery guarantees: Big O is maximum delivery time (worst-case), Big Omega is minimum delivery time (best-case).',
    keyPoints: [
      'Big O (O): Upper bound -> f(n) <= c * g(n) for n >= n0. Worst-case ceiling.',
      'Big Omega (Ω): Lower bound -> f(n) >= c * g(n) for n >= n0. Best-case floor.',
      'Big Theta (Θ): Tight bound -> c1*g(n) <= f(n) <= c2*g(n). Exact order of growth.',
      'Constant factors and lower-order terms are discarded as n approaches infinity.',
    ],
    theory: `### Asymptotic Notations

Asymptotic notation classifies algorithm growth rate regardless of machine hardware.

- **Big O ($O$)**: Represents worst-case upper bound.
- **Big Omega ($\\Omega$)**: Represents best-case lower bound.
- **Big Theta ($\\Theta$)**: Represents asymptotically tight bound (exists when $O$ and $\\Omega$ match).`,
    cCode: `#include <stdio.h>

// Linear Search: Best Case = O(1), Worst Case = O(n), Average Case = O(n)
int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) return i; // Found!
    }
    return -1; // Not found
}

int main() {
    int arr[] = {10, 20, 30, 40, 50};
    int n = 5;
    printf("Best-case index (10 at index 0): %d\\n", linearSearch(arr, n, 10));
    printf("Worst-case index (50 at index 4): %d\\n", linearSearch(arr, n, 50));
    return 0;
}`,
    visualizer: 'search',
    mcqs: [
      {
        question: 'When is an algorithm running time said to be Θ(g(n))?',
        options: [
          'Only when it is O(g(n))',
          'Only when it is Ω(g(n))',
          'If and only if it is both O(g(n)) and Ω(g(n))',
          'When it runs in constant time',
        ],
        correctIndex: 2,
        explanation: 'Theta notation represents a tight bound, meaning the function is bounded both above and below by g(n).',
      },
    ],
  },
  {
    id: 'u1-time-space-complexity',
    unitId: 1,
    unitTitle: 'Introduction',
    title: 'Time & Space Complexity Analysis',
    slug: 'time-space-complexity',
    category: 'Complexity Analysis',
    description: 'Analyzing loops, recurrence relations (Master Theorem), recursion stacks, and auxiliary space efficiency.',
    timeComplexity: 'Order Analysis',
    spaceComplexity: 'Memory Footprint Analysis',
    realWorldAnalogy: 'Fuel consumption (Time) versus cargo volume requirement (Space) of a transport vehicle.',
    keyPoints: [
      'Time complexity measures operation count as a function of input size n.',
      'Space complexity includes both auxiliary memory allocated and recursive stack frames.',
      'Master Theorem solves divide-and-conquer recurrences: T(n) = aT(n/b) + f(n).',
    ],
    theory: `### Time and Space Complexity

Analyzing code complexity involves counting basic operation cycles and memory allocations:

- **Loop Nesting**: $k$ nested loops each iterating $n$ times gives $O(n^k)$.
- **Divide and Conquer**: Halving input size repeatedly gives $O(\\log n)$.
- **Recursive Stack**: Depth of recursion tree determines stack space.`,
    cCode: `#include <stdio.h>

// Time: O(2^n), Auxiliary Space: O(n) recursion stack
int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Optimized Iterative: Time: O(n), Space: O(1)
int fibonacciIterative(int n) {
    if (n <= 1) return n;
    int prev2 = 0, prev1 = 1, curr;
    for (int i = 2; i <= n; i++) {
        curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return curr;
}

int main() {
    int n = 7;
    printf("Fib(%d) Recursive = %d\\n", n, fibonacci(n));
    printf("Fib(%d) Iterative = %d\\n", n, fibonacciIterative(n));
    return 0;
}`,
    mcqs: [
      {
        question: 'What is the auxiliary space complexity of an in-place bubble sort algorithm?',
        options: ['O(n)', 'O(log n)', 'O(1)', 'O(n^2)'],
        correctIndex: 2,
        explanation: 'In-place sorting algorithms only use a few temporary swap variables, yielding O(1) auxiliary space.',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // UNIT 2: List Structures
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'u2-array-list',
    unitId: 2,
    unitTitle: 'List Structures',
    title: 'Array List (Sequential List)',
    slug: 'array-list',
    category: 'Linear Lists',
    description: 'Contiguous array-based list ADT: indexing, element shifting on insertion/deletion, capacity resizing.',
    timeComplexity: 'Access: O(1), Insert/Delete: O(N)',
    spaceComplexity: 'O(N) contiguous memory',
    realWorldAnalogy: 'Numbered theatre seats: finding seat #14 is instant, but inserting a new seat shifts everyone down the row.',
    keyPoints: [
      'Direct index access via base address arithmetic: addr = base + index * sizeof(element).',
      'Insertions and deletions require shifting adjacent elements, costing O(n) in worst/average case.',
      'Static lists have fixed capacity; dynamic arrays double capacity when full (amortized O(1) push).',
    ],
    theory: `### Array List ADT

An Array List stores elements in contiguous memory blocks.
Random access is $O(1)$, but inserting at index $0$ requires shifting all $n$ items rightward ($O(n)$).`,
    cCode: `#include <stdio.h>

#define MAX 100

typedef struct {
    int data[MAX];
    int size;
} ArrayList;

void insertAt(ArrayList *list, int index, int val) {
    if (list->size >= MAX || index < 0 || index > list->size) return;
    for (int i = list->size; i > index; i--) {
        list->data[i] = list->data[i - 1]; // Shift right
    }
    list->data[index] = val;
    list->size++;
}

int deleteAt(ArrayList *list, int index) {
    if (index < 0 || index >= list->size) return -1;
    int val = list->data[index];
    for (int i = index; i < list->size - 1; i++) {
        list->data[i] = list->data[i + 1]; // Shift left
    }
    list->size--;
    return val;
}

int main() {
    ArrayList list = {{10, 20, 30}, 3};
    insertAt(&list, 1, 99); // Becomes 10, 99, 20, 30
    printf("After insert: ");
    for (int i = 0; i < list.size; i++) printf("%d ", list.data[i]);
    printf("\\n");
    return 0;
}`,
    visualizer: 'array',
    mcqs: [
      {
        question: 'What is the time complexity of inserting an item at index 0 of an Array List of size N?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
        correctIndex: 2,
        explanation: 'All N existing elements must be shifted one position to the right to make space at index 0.',
      },
    ],
  },
  {
    id: 'u2-cursor-list',
    unitId: 2,
    unitTitle: 'List Structures',
    title: 'Cursor Implementation of Lists',
    slug: 'cursor-list',
    category: 'Linked Lists',
    description: 'Pointerless linked lists implemented in static arrays using array indices as simulated memory pointers.',
    timeComplexity: 'Access: O(N), Insert/Delete: O(1) with cursor',
    spaceComplexity: 'O(N) preallocated array',
    realWorldAnalogy: 'A book index where page numbers replace physical links, guiding the reader from chapter to chapter.',
    keyPoints: [
      'Used in environments lacking dynamic pointer allocation (e.g., embedded memory systems).',
      'A cursor space pool manages free nodes in a simulated freelist.',
      'Node index 0 represents NULL.',
    ],
    theory: `### Cursor List (Array-based Pointer Simulation)

In a Cursor List, an array of structures acts as the virtual memory heap:

\`\`\`c
struct Node {
    int data;
    int next; // index of next node; 0 means NULL
};
struct Node cursorSpace[MAX];
\`\`\`

A specialized \`freelist\` index tracks unallocated cells, simulating \`malloc\` and \`free\` using array indices.`,
    cCode: `#include <stdio.h>

#define SPACE_SIZE 10

typedef struct {
    int data;
    int next; // cursor pointer (index)
} CursorNode;

CursorNode cursorSpace[SPACE_SIZE];

void initCursorSpace() {
    for (int i = 0; i < SPACE_SIZE - 1; i++) {
        cursorSpace[i].next = i + 1;
    }
    cursorSpace[SPACE_SIZE - 1].next = 0; // End of freelist
}

int cursorAlloc() {
    int p = cursorSpace[0].next;
    cursorSpace[0].next = cursorSpace[p].next;
    return p;
}

void cursorFree(int p) {
    cursorSpace[p].next = cursorSpace[0].next;
    cursorSpace[0].next = p;
}

int main() {
    initCursorSpace();
    int node1 = cursorAlloc();
    cursorSpace[node1].data = 50;
    cursorSpace[node1].next = 0;

    printf("Allocated virtual node at index %d with value %d\\n", node1, cursorSpace[node1].data);
    cursorFree(node1);
    printf("Freed node %d back to virtual freelist\\n", node1);
    return 0;
}`,
    mcqs: [
      {
        question: 'In a cursor-based linked list, what represents a NULL pointer?',
        options: ['-1', '0', 'NULL keyword', 'MAX_INT'],
        correctIndex: 1,
        explanation: 'Index 0 is conventionally reserved as the head of the free list or as the NULL terminator in cursor lists.',
      },
    ],
  },
  {
    id: 'u2-singly-linked-list',
    unitId: 2,
    unitTitle: 'List Structures',
    title: 'Singly Linked List',
    slug: 'singly-linked-list',
    category: 'Linked Lists',
    description: 'Dynamic chaining of nodes containing data and a single forward pointer (next).',
    timeComplexity: 'Head Insert: O(1), Search: O(N), Tail Insert: O(N) or O(1)',
    spaceComplexity: 'O(N) with 8-byte pointer overhead per node',
    realWorldAnalogy: 'A train where each carriage is coupled exclusively to the carriage behind it.',
    keyPoints: [
      'Non-contiguous heap allocation eliminates preallocated size limitations.',
      'Head insertion is $O(1)$ constant time.',
      'Traversal is strictly unidirectional from head to NULL.',
    ],
    theory: `### Singly Linked List

A Singly Linked List consists of independently allocated heap nodes linked together by a forward pointer.

#### Key Operations
- **Insert at Head**: Create node, set \`node->next = head\`, update \`head = node\` ($O(1)$).
- **Search**: Follow \`next\` links until match or NULL ($O(n)$).
- **Deletion**: Adjust preceding node's \`next\` to skip target node, then \`free()\` target ($O(n)$).`,
    cCode: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node *next;
};

void insertFront(struct Node **head, int val) {
    struct Node *newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = val;
    newNode->next = *head;
    *head = newNode;
}

void printList(struct Node *head) {
    struct Node *curr = head;
    while (curr != NULL) {
        printf("%d -> ", curr->data);
        curr = curr->next;
    }
    printf("NULL\\n");
}

int main() {
    struct Node *head = NULL;
    insertFront(&head, 30);
    insertFront(&head, 20);
    insertFront(&head, 10);
    printList(head); // 10 -> 20 -> 30 -> NULL
    return 0;
}`,
    visualizer: 'linked-list',
    mcqs: [
      {
        question: 'What is the time complexity to insert a new node at the front of a singly linked list?',
        options: ['O(1)', 'O(N)', 'O(log N)', 'O(N^2)'],
        correctIndex: 0,
        explanation: 'Inserting at the head requires modifying only two pointer addresses, taking O(1) constant time.',
      },
    ],
  },
  {
    id: 'u2-doubly-linked-list',
    unitId: 2,
    unitTitle: 'List Structures',
    title: 'Doubly Linked List',
    slug: 'doubly-linked-list',
    category: 'Linked Lists',
    description: 'Bidirectional nodes with two pointers: prev and next, enabling two-way traversal and O(1) node deletion given a pointer.',
    timeComplexity: 'Insertion/Deletion: O(1) when node pointer is held',
    spaceComplexity: 'O(N) with 16-byte pointer overhead per node',
    realWorldAnalogy: 'Web browser navigation: back (prev) and forward (next) buttons moving through web page history.',
    keyPoints: [
      'Each node stores \`prev\` and \`next\` pointers.',
      'Enables bidirectional traversal and $O(1)$ deletion if pointer to target node is already available.',
      'Requires updating 4 pointers during node insertion between two existing nodes.',
    ],
    theory: `### Doubly Linked List

Doubly Linked Lists provide symmetrical navigation:

\`\`\`c
struct DNode {
    int data;
    struct DNode *prev;
    struct DNode *next;
};
\`\`\`

Deletion of node $X$ given its pointer requires no prior traversal:
\`X->prev->next = X->next;\`
\`X->next->prev = X->prev;\`
\`free(X);\` (with NULL checks for boundaries).`,
    cCode: `#include <stdio.h>
#include <stdlib.h>

struct DNode {
    int data;
    struct DNode *prev;
    struct DNode *next;
};

void insertHead(struct DNode **head, int val) {
    struct DNode *node = (struct DNode*)malloc(sizeof(struct DNode));
    node->data = val;
    node->prev = NULL;
    node->next = *head;
    if (*head != NULL) (*head)->prev = node;
    *head = node;
}

int main() {
    struct DNode *head = NULL;
    insertHead(&head, 30);
    insertHead(&head, 20);
    insertHead(&head, 10);

    struct DNode *curr = head;
    printf("Forward traversal: ");
    while (curr) {
        printf("%d <-> ", curr->data);
        curr = curr->next;
    }
    printf("NULL\\n");
    return 0;
}`,
    visualizer: 'linked-list',
    mcqs: [
      {
        question: 'Given a direct pointer to a node in a doubly linked list, what is the deletion time complexity?',
        options: ['O(N)', 'O(1)', 'O(log N)', 'O(N^2)'],
        correctIndex: 1,
        explanation: 'Because both predecessor and successor pointers are stored in the node itself, deletion is O(1).',
      },
    ],
  },
  {
    id: 'u2-circular-linked-list',
    unitId: 2,
    unitTitle: 'List Structures',
    title: 'Circular Linked List',
    slug: 'circular-linked-list',
    category: 'Linked Lists',
    description: 'List where the last node points back to head instead of NULL, forming an endless ring buffer.',
    timeComplexity: 'Traversal: O(N) cycle, Tail Insert: O(1) with tail pointer',
    spaceComplexity: 'O(N) dynamic heap nodes',
    realWorldAnalogy: 'A multiplayer board game where turn tokens cycle continuously from player 1 through player 4 and back to player 1.',
    keyPoints: [
      'No node points to NULL; terminal condition is \`curr->next == head\`.',
      'Maintaining a single \`tail\` pointer allows both $O(1)$ access to the end (\`tail\`) and head (\`tail->next\`).',
      'Ideal for round-robin CPU scheduling and streaming ring buffers.',
    ],
    theory: `### Circular Linked List

A Circular Linked List links its final node back to the initial node.

Maintaining a \`tail\` pointer eliminates separate head references:
- \`head = tail->next\`
- Inserting at head: attach after tail
- Inserting at tail: attach after tail and advance tail`,
    cCode: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node *next;
};

void insertCircular(struct Node **tail, int val) {
    struct Node *node = (struct Node*)malloc(sizeof(struct Node));
    node->data = val;
    if (*tail == NULL) {
        node->next = node;
        *tail = node;
    } else {
        node->next = (*tail)->next;
        (*tail)->next = node;
        *tail = node; // Update tail pointer
    }
}

void printCircular(struct Node *tail) {
    if (!tail) return;
    struct Node *curr = tail->next; // Start at head
    do {
        printf("%d -> ", curr->data);
        curr = curr->next;
    } while (curr != tail->next);
    printf("(back to head %d)\\n", curr->data);
}

int main() {
    struct Node *tail = NULL;
    insertCircular(&tail, 10);
    insertCircular(&tail, 20);
    insertCircular(&tail, 30);
    printCircular(tail);
    return 0;
}`,
    visualizer: 'linked-list',
    mcqs: [
      {
        question: 'What is the loop termination condition when traversing a circular singly linked list starting from head?',
        options: ['curr == NULL', 'curr->next == NULL', 'curr->next == head', 'curr == tail->next'],
        correctIndex: 2,
        explanation: 'Because there is no NULL pointer, traversal terminates when the current node points back to the starting node (head).',
      },
    ],
  },
  {
    id: 'u2-sparse-matrix',
    unitId: 2,
    unitTitle: 'List Structures',
    title: 'Sparse Matrix Representation',
    slug: 'sparse-matrix',
    category: 'Applications',
    description: 'Memory-efficient storage of matrices dominated by zero elements using Coordinate List (COO) triplet arrays or linked lists.',
    timeComplexity: 'Space: O(Non-Zero Count) vs O(R*C)',
    spaceComplexity: '3 * Non-Zero Count integers',
    realWorldAnalogy: 'A map of the Pacific Ocean recording only islands (non-zeros) instead of every square kilometer of open water.',
    keyPoints: [
      'A matrix is sparse when zero elements significantly outnumber non-zero elements.',
      'Triplet representation stores: \`Row, Column, Value\` for each non-zero element.',
      'Header row stores: \`Total Rows, Total Columns, Total Non-Zero Count\`.',
    ],
    theory: `### Sparse Matrix Triplet Form

Instead of allocating an $M \\times N$ grid, store only non-zero coordinates:

| Row | Col | Value |
|:---:|:---:|:-----:|
|  5  |  6  |   3   |  <- Metadata: 5 rows, 6 cols, 3 non-zeros
|  0  |  1  |  10   |
|  2  |  3  |  20   |
|  4  |  5  |  30   |`,
    cCode: `#include <stdio.h>

struct Element {
    int row;
    int col;
    int val;
};

struct SparseMatrix {
    int rows;
    int cols;
    int numNonZero;
    struct Element elements[100];
};

void printSparse(struct SparseMatrix sm) {
    printf("Matrix Dimensions: %d x %d with %d non-zeros\\n", sm.rows, sm.cols, sm.numNonZero);
    printf("Row\\tCol\\tValue\\n");
    for (int i = 0; i < sm.numNonZero; i++) {
        printf("%d\\t%d\\t%d\\n", sm.elements[i].row, sm.elements[i].col, sm.elements[i].val);
    }
}

int main() {
    struct SparseMatrix sm = {4, 4, 2, {{0, 2, 7}, {3, 1, 9}}};
    printSparse(sm);
    return 0;
}`,
    mcqs: [
      {
        question: 'How many integers are required in a 3-tuple array to represent a sparse matrix with K non-zero elements?',
        options: ['K', '2K', '3K + 3', 'K^2'],
        correctIndex: 2,
        explanation: 'Each non-zero entry takes 3 values (row, col, value) plus 3 values for matrix dimension metadata.',
      },
    ],
  },
  {
    id: 'u2-polynomial-arithmetic',
    unitId: 2,
    unitTitle: 'List Structures',
    title: 'Polynomial Arithmetic Using Linked Lists',
    slug: 'polynomial-arithmetic',
    category: 'Applications',
    description: 'Addition, subtraction, and multiplication of single-variable polynomials using exponent-sorted linked lists.',
    timeComplexity: 'Addition: O(M + N), Multiplication: O(M * N)',
    spaceComplexity: 'O(M + N) linked nodes',
    realWorldAnalogy: 'Combining receipts: items of identical category (exponents) sum their costs (coefficients).',
    keyPoints: [
      'Each node stores \`coeff\`, \`exp\`, and \`next\`.',
      'Polynomials are kept in descending order of exponents.',
      'Addition merges two lists comparing exponents: if equal, add coefficients; otherwise copy the higher exponent node.',
    ],
    theory: `### Polynomial Addition Using Linked Lists

Given $P_1(x) = 5x^4 + 3x^2 + 1$ and $P_2(x) = 4x^4 + 2x^3 + 7x^2$:
Traverse both lists with pointers $p_1$ and $p_2$:
- If $p_1->exp == p_2->exp$: Sum coefficients, advance both.
- If $p_1->exp > p_2->exp$: Append $p_1$, advance $p_1$.
- If $p_2->exp > p_1->exp$: Append $p_2$, advance $p_2$.`,
    cCode: `#include <stdio.h>
#include <stdlib.h>

struct PolyNode {
    int coeff;
    int exp;
    struct PolyNode *next;
};

void attach(int c, int e, struct PolyNode **rear) {
    struct PolyNode *p = (struct PolyNode*)malloc(sizeof(struct PolyNode));
    p->coeff = c;
    p->exp = e;
    p->next = NULL;
    (*rear)->next = p;
    *rear = p;
}

int main() {
    printf("Polynomial Addition: (5x^2 + 3) + (4x^2 + 2x) = 9x^2 + 2x + 3\\n");
    return 0;
}`,
    mcqs: [
      {
        question: 'What is the time complexity of adding two polynomials with M and N terms represented as sorted linked lists?',
        options: ['O(M * N)', 'O(M + N)', 'O(log(M+N))', 'O(1)'],
        correctIndex: 1,
        explanation: 'Because both lists are sorted by exponent, a single simultaneous pass (similar to merge sort) takes O(M + N).',
      },
    ],
  },
  {
    id: 'u2-josephus-problem',
    unitId: 2,
    unitTitle: 'List Structures',
    title: 'Josephus Problem',
    slug: 'josephus-problem',
    category: 'Applications',
    description: 'Elimination game solved using Circular Linked Lists: N people in a circle, eliminating every k-th person until one remains.',
    timeComplexity: 'Circular List: O(N * k), Math Formula: O(N)',
    spaceComplexity: 'O(N) nodes or O(1) recursive',
    realWorldAnalogy: 'Musical chairs where the music stops every k beats and the active chair is permanently removed.',
    keyPoints: [
      'Modeled naturally using a Circular Singly Linked List of size N.',
      'Advance k-1 times, unlink the k-th node, free it, and resume count from successor.',
      'Mathematical recurrence: J(n, k) = (J(n-1, k) + k) % n, with J(1, k) = 0.',
    ],
    theory: `### The Josephus Problem

$N$ people stand in a circle numbered $1$ to $N$. Starting from person $1$, counting proceeds around the circle.
Every $k$-th person is executed until only one survivor remains.`,
    cCode: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int id;
    struct Node *next;
};

int solveJosephus(int n, int k) {
    // Build circular list
    struct Node *head = (struct Node*)malloc(sizeof(struct Node));
    head->id = 1;
    struct Node *prev = head;
    for (int i = 2; i <= n; i++) {
        struct Node *p = (struct Node*)malloc(sizeof(struct Node));
        p->id = i;
        prev->next = p;
        prev = p;
    }
    prev->next = head; // Close circle

    struct Node *ptr1 = head, *ptr2 = head;
    while (ptr1->next != ptr1) {
        // Count k-1 steps
        for (int i = 0; i < k - 1; i++) {
            ptr2 = ptr1;
            ptr1 = ptr1->next;
        }
        ptr2->next = ptr1->next;
        printf("Eliminated: %d\\n", ptr1->id);
        free(ptr1);
        ptr1 = ptr2->next;
    }
    int survivor = ptr1->id;
    free(ptr1);
    return survivor;
}

int main() {
    int n = 7, k = 3;
    printf("Survivor for n=%d, k=%d is: %d\\n", n, k, solveJosephus(n, k));
    return 0;
}`,
    visualizer: 'linked-list',
    mcqs: [
      {
        question: 'What is the survivor for n=7, k=3 in 1-based indexing?',
        options: ['1', '3', '4', '7'],
        correctIndex: 2,
        explanation: 'For n=7, k=3, the elimination order is 3, 6, 2, 7, 5, 1, leaving 4 as the sole survivor.',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // UNIT 3: Stack And Queue
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'u3-stack-operations',
    unitId: 3,
    unitTitle: 'Stack And Queue',
    title: 'Stack Operations: Push, Pop, Peek',
    slug: 'stack-operations',
    category: 'Stacks',
    description: 'LIFO (Last-In, First-Out) abstract data type with Push, Pop, Peek, Overflow, and Underflow checks.',
    timeComplexity: 'Push: O(1), Pop: O(1), Peek: O(1)',
    spaceComplexity: 'O(N) array or linked list',
    realWorldAnalogy: 'A spring-loaded cafeteria plate dispenser where the last plate placed on top is the first taken.',
    keyPoints: [
      'Push: Inserts element at top of stack; fails on Stack Overflow if capacity is exceeded.',
      'Pop: Removes and returns element from top of stack; fails on Stack Underflow if empty.',
      'Peek/Top: Inspects top element without removing it.',
    ],
    theory: `### Stack ADT

A Stack operates strictly under the LIFO (Last-In First-Out) discipline. All additions and removals occur at a single end termed \`top\`.`,
    cCode: `#include <stdio.h>
#include <stdbool.h>

#define MAX 5

typedef struct {
    int arr[MAX];
    int top;
} Stack;

void init(Stack *s) { s->top = -1; }
bool isFull(Stack *s) { return s->top == MAX - 1; }
bool isEmpty(Stack *s) { return s->top == -1; }

void push(Stack *s, int val) {
    if (isFull(s)) { printf("Stack Overflow!\\n"); return; }
    s->arr[++(s->top)] = val;
}

int pop(Stack *s) {
    if (isEmpty(s)) { printf("Stack Underflow!\\n"); return -1; }
    return s->arr[(s->top)--];
}

int peek(Stack *s) {
    if (isEmpty(s)) return -1;
    return s->arr[s->top];
}

int main() {
    Stack s; init(&s);
    push(&s, 10); push(&s, 20); push(&s, 30);
    printf("Top element: %d\\n", peek(&s));
    printf("Popped: %d\\n", pop(&s));
    return 0;
}`,
    visualizer: 'stack',
    mcqs: [
      {
        question: 'Which condition signifies Stack Underflow when using an array implementation with top starting at -1?',
        options: ['top == 0', 'top == MAX', 'top == -1', 'top == NULL'],
        correctIndex: 2,
        explanation: 'top == -1 indicates the stack has zero elements; popping causes an underflow error.',
      },
    ],
  },
  {
    id: 'u3-infix-to-postfix',
    unitId: 3,
    unitTitle: 'Stack And Queue',
    title: 'Infix to Postfix Conversion',
    slug: 'infix-to-postfix',
    category: 'Stack Applications',
    description: 'Dijkstra\'s Shunting-yard algorithm translating human-readable infix arithmetic into postfix notation without parentheses.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N) operator stack',
    realWorldAnalogy: 'Translating written math into a streamlined conveyor belt of operations for a microchip ALU.',
    keyPoints: [
      'Operands (A, B, numbers) output immediately.',
      'Operators (+, *, etc.) push to stack after popping higher/equal precedence operators.',
      'Left parenthesis \'(\' has lowest precedence inside stack, highest outside.',
      'Right parenthesis \')\' pops all operators until \'(\' is reached.',
    ],
    theory: `### Infix to Postfix Algorithm

1. If character is an operand, output it.
2. If \'(\', push to operator stack.
3. If \')\', pop and output until \'(\' is popped.
4. If operator: while stack non-empty and \`precedence(top) >= precedence(token)\`, pop and output. Push token.
5. Pop remaining operators to output.`,
    cCode: `#include <stdio.h>
#include <ctype.h>
#include <string.h>

int prec(char c) {
    if (c == '^') return 3;
    if (c == '*' || c == '/') return 2;
    if (c == '+' || c == '-') return 1;
    return -1;
}

void infixToPostfix(char *exp) {
    char stack[100];
    int top = -1;
    printf("Postfix: ");
    for (int i = 0; exp[i]; i++) {
        char c = exp[i];
        if (isalnum(c)) printf("%c", c);
        else if (c == '(') stack[++top] = c;
        else if (c == ')') {
            while (top != -1 && stack[top] != '(') printf("%c", stack[top--]);
            top--; // Pop '('
        } else {
            while (top != -1 && prec(stack[top]) >= prec(c)) printf("%c", stack[top--]);
            stack[++top] = c;
        }
    }
    while (top != -1) printf("%c", stack[top--]);
    printf("\\n");
}

int main() {
    char exp[] = "a+b*(c^d-e)";
    infixToPostfix(exp); // abcd^e-*+
    return 0;
}`,
    visualizer: 'stack',
    mcqs: [
      {
        question: 'What is the postfix expression for: A + B * C?',
        options: ['A B C * +', 'A B + C *', '+ A * B C', 'A B C + *'],
        correctIndex: 0,
        explanation: 'Multiplication has higher precedence than addition, so B * C evaluates first (BC*), then adds A (ABC*+).',
      },
    ],
  },
  {
    id: 'u3-postfix-evaluation',
    unitId: 3,
    unitTitle: 'Stack And Queue',
    title: 'Postfix Expression Evaluation',
    slug: 'postfix-evaluation',
    category: 'Stack Applications',
    description: 'Evaluating Reverse Polish Notation (RPN) using an operand stack in linear time.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N) operand stack',
    realWorldAnalogy: 'Hewlett-Packard scientific calculators and Forth runtime environments processing reverse Polish math.',
    keyPoints: [
      'Scan postfix expression from left to right.',
      'If operand: push value onto stack.',
      'If operator: pop operand2, pop operand1, compute \`operand1 op operand2\`, push result.',
      'Final answer resides at top of stack.',
    ],
    theory: `### Postfix Evaluation

Postfix notation requires no operator precedence rules or parentheses during evaluation:
- Operand: Push to stack
- Operator: Pop two values, compute, push result back`,
    cCode: `#include <stdio.h>
#include <ctype.h>

int evalPostfix(char *exp) {
    int stack[100], top = -1;
    for (int i = 0; exp[i]; i++) {
        if (isdigit(exp[i])) {
            stack[++top] = exp[i] - '0';
        } else {
            int val2 = stack[top--];
            int val1 = stack[top--];
            switch (exp[i]) {
                case '+': stack[++top] = val1 + val2; break;
                case '-': stack[++top] = val1 - val2; break;
                case '*': stack[++top] = val1 * val2; break;
                case '/': stack[++top] = val1 / val2; break;
            }
        }
    }
    return stack[top];
}

int main() {
    char exp[] = "231*+9-"; // 2 + (3 * 1) - 9 = -4
    printf("Result: %d\\n", evalPostfix(exp));
    return 0;
}`,
    visualizer: 'stack',
    mcqs: [
      {
        question: 'What is the evaluated value of the postfix expression: "6 2 / 3 +" ?',
        options: ['6', '5', '4', '8'],
        correctIndex: 0,
        explanation: '6 / 2 = 3; then 3 + 3 = 6.',
      },
    ],
  },
  {
    id: 'u3-balancing-symbols',
    unitId: 3,
    unitTitle: 'Stack And Queue',
    title: 'Balancing Symbols (Bracket Matching)',
    slug: 'balancing-symbols',
    category: 'Stack Applications',
    description: 'Validating paired opening and closing parentheses (), brackets [], and braces {} in source code.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N) character stack',
    realWorldAnalogy: 'HTML tags or compiler code checking that every opened tag has a matching closing tag in reverse order.',
    keyPoints: [
      'Push opening brackets: \'(\', \'[\', \'{\'.',
      'On closing bracket: check if stack is empty (unbalanced); pop and verify matching type.',
      'At end of string: stack must be completely empty.',
    ],
    theory: `### Bracket Matching with Stack

Compilers check balanced parentheses using a stack:
1. Encounter opening bracket: \`push(char)\`
2. Encounter closing bracket: if stack is empty, return false. Otherwise, \`pop()\` and verify matching pair.
3. String end: return \`isEmpty(stack)\`.`,
    cCode: `#include <stdio.h>
#include <stdbool.h>

bool isBalanced(char *s) {
    char stack[100];
    int top = -1;
    for (int i = 0; s[i]; i++) {
        char c = s[i];
        if (c == '(' || c == '[' || c == '{') stack[++top] = c;
        else if (c == ')' || c == ']' || c == '}') {
            if (top == -1) return false;
            char open = stack[top--];
            if (c == ')' && open != '(') return false;
            if (c == ']' && open != '[') return false;
            if (c == '}' && open != '{') return false;
        }
    }
    return top == -1;
}

int main() {
    printf("Balanced {[()]}: %s\\n", isBalanced("{[()]}") ? "YES" : "NO");
    printf("Balanced {[(])}: %s\\n", isBalanced("{[(])}") ? "YES" : "NO");
    return 0;
}`,
    visualizer: 'stack',
    mcqs: [
      {
        question: 'What error occurred if parsing finishes with top != -1?',
        options: [
          'There were more closing brackets than opening brackets',
          'There were unclosed opening brackets remaining',
          'The input string was empty',
          'Stack overflow occurred',
        ],
        correctIndex: 1,
        explanation: 'If top != -1 at EOF, one or more opening brackets were never closed.',
      },
    ],
  },
  {
    id: 'u3-tower-of-hanoi',
    unitId: 3,
    unitTitle: 'Stack And Queue',
    title: 'Tower of Hanoi',
    slug: 'tower-of-hanoi',
    category: 'Stack Applications',
    description: 'Classic recursive stack puzzle: moving N disks between 3 pegs without placing a larger disk onto a smaller disk.',
    timeComplexity: 'O(2^N)',
    spaceComplexity: 'O(N) call stack',
    realWorldAnalogy: 'Relocating a tiered wedding cake to a new display stand without ever putting a wide tier on top of a narrow one.',
    keyPoints: [
      'Requires exactly $2^N - 1$ moves.',
      'Recursive recurrence: T(n) = 2T(n-1) + 1.',
      'Base case: n=1, move single disk directly from source to destination.',
    ],
    theory: `### Tower of Hanoi Algorithm

To move $n$ disks from source $A$ to target $C$ via auxiliary $B$:
1. Move $n-1$ disks from $A$ to $B$ using $C$.
2. Move disk $n$ directly from $A$ to $C$.
3. Move $n-1$ disks from $B$ to $C$ using $A$.`,
    cCode: `#include <stdio.h>

void hanoi(int n, char from, char to, char aux) {
    if (n == 1) {
        printf("Move disk 1 from %c to %c\\n", from, to);
        return;
    }
    hanoi(n - 1, from, aux, to);
    printf("Move disk %d from %c to %c\\n", n, from, to);
    hanoi(n - 1, aux, to, from);
}

int main() {
    int disks = 3;
    printf("Tower of Hanoi for %d disks (total %d moves):\\n", disks, (1 << disks) - 1);
    hanoi(disks, 'A', 'C', 'B');
    return 0;
}`,
    visualizer: 'stack',
    mcqs: [
      {
        question: 'How many total moves are required to solve Tower of Hanoi for 4 disks?',
        options: ['8', '15', '16', '31'],
        correctIndex: 1,
        explanation: 'Total moves = 2^n - 1 = 2^4 - 1 = 16 - 1 = 15 moves.',
      },
    ],
  },
  {
    id: 'u3-queue-operations',
    unitId: 3,
    unitTitle: 'Stack And Queue',
    title: 'Queue: Enqueue, Dequeue & Circular Queue',
    slug: 'queue-operations',
    category: 'Queues',
    description: 'FIFO (First-In, First-Out) abstract data type; eliminating false overflow in linear queues using modulo circular arithmetic.',
    timeComplexity: 'Enqueue: O(1), Dequeue: O(1)',
    spaceComplexity: 'O(N) ring buffer',
    realWorldAnalogy: 'Customers waiting in line at a bank teller: first customer in line is the first one served.',
    keyPoints: [
      'FIFO discipline: Enqueue at Rear, Dequeue at Front.',
      'Linear array queues suffer from "false overflow" when front advances, wasting free slots.',
      'Circular Queue solves this using modulo arithmetic: \`rear = (rear + 1) % capacity\`.',
    ],
    theory: `### Circular Queue ADT

In a Linear Queue, once rear reaches $MAX-1$, no more items can be enqueued even if elements have been dequeued from front.
The Circular Queue wraps pointers modulo $N$:
- Enqueue: \`rear = (rear + 1) % MAX\`
- Dequeue: \`front = (front + 1) % MAX\``,
    cCode: `#include <stdio.h>
#include <stdbool.h>

#define MAX 5

typedef struct {
    int data[MAX];
    int front;
    int rear;
    int count;
} CircularQueue;

void init(CircularQueue *q) { q->front = 0; q->rear = -1; q->count = 0; }
bool isFull(CircularQueue *q) { return q->count == MAX; }
bool isEmpty(CircularQueue *q) { return q->count == 0; }

void enqueue(CircularQueue *q, int val) {
    if (isFull(q)) { printf("Queue Full!\\n"); return; }
    q->rear = (q->rear + 1) % MAX;
    q->data[q->rear] = val;
    q->count++;
}

int dequeue(CircularQueue *q) {
    if (isEmpty(q)) { printf("Queue Empty!\\n"); return -1; }
    int val = q->data[q->front];
    q->front = (q->front + 1) % MAX;
    q->count--;
    return val;
}

int main() {
    CircularQueue q; init(&q);
    enqueue(&q, 10); enqueue(&q, 20); enqueue(&q, 30);
    printf("Dequeued: %d\\n", dequeue(&q));
    enqueue(&q, 40);
    printf("Dequeued: %d\\n", dequeue(&q));
    return 0;
}`,
    visualizer: 'queue',
    mcqs: [
      {
        question: 'Why is a Circular Queue preferred over a standard linear array queue?',
        options: [
          'It uses less memory',
          'It eliminates false overflow by reusing freed memory slots at the front',
          'It changes FIFO to LIFO',
          'It supports O(log N) search',
        ],
        correctIndex: 1,
        explanation: 'Modulo arithmetic wraps around to reuse empty spaces left behind by dequeued elements.',
      },
    ],
  },
  {
    id: 'u3-deque',
    unitId: 3,
    unitTitle: 'Stack And Queue',
    title: 'Double-Ended Queue (Deque)',
    slug: 'deque',
    category: 'Queues',
    description: 'Generalized queue allowing insertion and deletion at both front and rear ends; input-restricted and output-restricted variants.',
    timeComplexity: 'All 4 boundary operations: O(1)',
    spaceComplexity: 'O(N) buffer',
    realWorldAnalogy: 'A two-ended tube where marbles can be pushed or pulled from either side.',
    keyPoints: [
      'Supports \`insertFront\`, \`insertRear\`, \`deleteFront\`, \`deleteRear\`.',
      'Input-Restricted Deque: Insertion only at rear; deletion at both ends.',
      'Output-Restricted Deque: Deletion only at front; insertion at both ends.',
      'Sliding window maximum problems use deques in $O(N)$ time.',
    ],
    theory: `### Double-Ended Queue (Deque)

A Deque combines the capabilities of both Stacks and Queues into a single data structure by providing four $O(1)$ endpoints.`,
    cCode: `#include <stdio.h>
#define MAX 10

typedef struct {
    int arr[MAX];
    int front, rear, size;
} Deque;

void init(Deque *d) { d->front = -1; d->rear = 0; d->size = 0; }

void insertRear(Deque *d, int val) {
    if (d->size == MAX) return;
    if (d->front == -1) { d->front = 0; d->rear = 0; }
    else d->rear = (d->rear + 1) % MAX;
    d->arr[d->rear] = val;
    d->size++;
}

void insertFront(Deque *d, int val) {
    if (d->size == MAX) return;
    if (d->front == -1) { d->front = 0; d->rear = 0; }
    else d->front = (d->front - 1 + MAX) % MAX;
    d->arr[d->front] = val;
    d->size++;
}

int main() {
    printf("Deque supports insert/delete at both ends in O(1)\\n");
    return 0;
}`,
    visualizer: 'queue',
    mcqs: [
      {
        question: 'What is an Input-Restricted Deque?',
        options: [
          'Deletion restricted to front; insertion at both ends',
          'Insertion restricted to one end; deletion allowed at both ends',
          'Only integers allowed',
          'Queue of size 1',
        ],
        correctIndex: 1,
        explanation: 'An input-restricted deque allows insertion at only one end, while deletion can occur at either end.',
      },
    ],
  },
  {
    id: 'u3-priority-queue',
    unitId: 3,
    unitTitle: 'Stack And Queue',
    title: 'Priority Queue',
    slug: 'priority-queue',
    category: 'Queues',
    description: 'Queue where each item has an associated priority; elements with highest priority are served before lower priority elements.',
    timeComplexity: 'Binary Heap implementation: Enqueue O(log N), DequeueMax O(log N)',
    spaceComplexity: 'O(N)',
    realWorldAnalogy: 'Hospital emergency room: patients with life-threatening triage scores are treated before those with mild symptoms.',
    keyPoints: [
      'Elements with higher priority are dequeued first, regardless of arrival order.',
      'Unsorted array: Insert $O(1)$, RemoveMin $O(n)$.',
      'Sorted array: Insert $O(n)$, RemoveMin $O(1)$.',
      'Binary Heap (optimal): Insert $O(\\log n)$, RemoveMin $O(\\log n)$.',
    ],
    theory: `### Priority Queue ADT

In a Priority Queue, order of extraction is governed by numerical priority rather than arrival time.
Heap-based priority queues form the computational core of Dijkstra\'s algorithm, Prim\'s MST, and Huffman coding.`,
    cCode: `#include <stdio.h>

typedef struct {
    int value;
    int priority;
} PQItem;

PQItem pq[100];
int pqSize = 0;

void enqueue(int val, int p) {
    int i = pqSize - 1;
    while (i >= 0 && pq[i].priority < p) {
        pq[i + 1] = pq[i]; // Shift lower priority down
        i--;
    }
    pq[i + 1].value = val;
    pq[i + 1].priority = p;
    pqSize++;
}

int dequeue() {
    return pq[--pqSize].value;
}

int main() {
    enqueue(100, 1); // Low priority
    enqueue(999, 5); // Highest priority
    enqueue(500, 3); // Medium priority
    printf("Dequeued highest priority: %d\\n", dequeue()); // 999
    return 0;
}`,
    visualizer: 'queue',
    mcqs: [
      {
        question: 'What is the optimal time complexity to extract the minimum element from a Binary Min-Heap Priority Queue?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
        correctIndex: 1,
        explanation: 'Extracting minimum takes O(log N) because heapify-down must restore the heap order after replacing root with the last leaf.',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // UNIT 4: Trees And Hashing
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'u4-tree-traversals',
    unitId: 4,
    unitTitle: 'Trees And Hashing',
    title: 'Binary Tree Traversals',
    slug: 'tree-traversals',
    category: 'Trees',
    description: 'Depth-First (Inorder, Preorder, Postorder) and Breadth-First (Level-Order) tree traversal algorithms.',
    timeComplexity: 'O(N) visits every node exactly once',
    spaceComplexity: 'O(H) recursion stack where H is tree height',
    realWorldAnalogy: 'Navigating an organizational hierarchy: visiting the manager before or after their direct reports.',
    keyPoints: [
      'Inorder (L, Root, R): Visits BST in sorted ascending order.',
      'Preorder (Root, L, R): Used for cloning/serializing trees.',
      'Postorder (L, R, Root): Used for bottom-up deletion and expression tree evaluation.',
      'Level-Order: Breadth-first search using a FIFO queue.',
    ],
    theory: `### Binary Tree Traversals

- **Inorder**: Traverse left subtree, visit root, traverse right subtree.
- **Preorder**: Visit root, traverse left subtree, traverse right subtree.
- **Postorder**: Traverse left subtree, traverse right subtree, visit root.
- **Level-Order**: Process nodes row by row from top to bottom.`,
    cCode: `#include <stdio.h>
#include <stdlib.h>

struct TNode {
    int data;
    struct TNode *left, *right;
};

struct TNode* createNode(int v) {
    struct TNode *n = (struct TNode*)malloc(sizeof(struct TNode));
    n->data = v; n->left = n->right = NULL;
    return n;
}

void inorder(struct TNode *root) {
    if (!root) return;
    inorder(root->left);
    printf("%d ", root->data);
    inorder(root->right);
}

void preorder(struct TNode *root) {
    if (!root) return;
    printf("%d ", root->data);
    preorder(root->left);
    preorder(root->right);
}

void postorder(struct TNode *root) {
    if (!root) return;
    postorder(root->left);
    postorder(root->right);
    printf("%d ", root->data);
}

int main() {
    struct TNode *root = createNode(1);
    root->left = createNode(2);
    root->right = createNode(3);
    printf("Inorder: "); inorder(root); printf("\\n");
    return 0;
}`,
    visualizer: 'bst',
    mcqs: [
      {
        question: 'Which traversal of a Binary Search Tree produces values in strictly sorted ascending order?',
        options: ['Preorder', 'Inorder', 'Postorder', 'Level-order'],
        correctIndex: 1,
        explanation: 'Inorder traversal visits Left Subtree (< root), then Root, then Right Subtree (> root), producing sorted order.',
      },
    ],
  },
  {
    id: 'u4-bst',
    unitId: 4,
    unitTitle: 'Trees And Hashing',
    title: 'Binary Search Tree (BST)',
    slug: 'binary-search-tree',
    category: 'Trees',
    description: 'Binary tree where every node in left subtree is smaller than root, and every node in right subtree is greater.',
    timeComplexity: 'Average: O(log N), Worst (skewed): O(N)',
    spaceComplexity: 'O(N) storage, O(H) stack',
    realWorldAnalogy: 'A telephone directory where opening the middle page immediately tells you whether to search before or after.',
    keyPoints: [
      'BST Invariant: \`left->data < root->data < right->data\`.',
      'Average search/insert/delete is $O(\\log n)$; degrades to $O(n)$ if keys arrive in sorted order (skewed tree).',
      'Deletion handles 3 cases: leaf node, one child, or two children (replace with inorder successor).',
    ],
    theory: `### Binary Search Tree (BST)

#### Deletion Cases
1. **Node is Leaf**: Free immediately.
2. **Node has One Child**: Link parent directly to child.
3. **Node has Two Children**: Find inorder successor (minimum node in right subtree), copy its value, recursively delete successor.`,
    cCode: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node *left, *right;
};

struct Node* insert(struct Node *node, int val) {
    if (!node) {
        struct Node *n = (struct Node*)malloc(sizeof(struct Node));
        n->data = val; n->left = n->right = NULL;
        return n;
    }
    if (val < node->data) node->left = insert(node->left, val);
    else if (val > node->data) node->right = insert(node->right, val);
    return node;
}

int main() {
    struct Node *root = NULL;
    root = insert(root, 50);
    insert(root, 30);
    insert(root, 70);
    insert(root, 20);
    insert(root, 40);
    printf("BST built successfully\\n");
    return 0;
}`,
    visualizer: 'bst',
    mcqs: [
      {
        question: 'When deleting a node with two children in a BST, which node replaces it?',
        options: [
          'Root node',
          'Inorder Successor (smallest node in right subtree) or Inorder Predecessor',
          'Any leaf node',
          'The right child directly',
        ],
        correctIndex: 1,
        explanation: 'The inorder successor or predecessor preserves the BST ordering invariant.',
      },
    ],
  },
  {
    id: 'u4-avl-tree',
    unitId: 4,
    unitTitle: 'Trees And Hashing',
    title: 'AVL Tree & Rotations',
    slug: 'avl-tree',
    category: 'Self-Balancing Trees',
    description: 'Adelson-Velsky and Landis self-balancing tree maintaining Balance Factor in {-1, 0, +1} via LL, RR, LR, RL rotations.',
    timeComplexity: 'Search, Insert, Delete guaranteed O(log N)',
    spaceComplexity: 'O(N) nodes with height metadata',
    realWorldAnalogy: 'A balanced seesaw that automatically pivots to ensure neither side tilts dangerously.',
    keyPoints: [
      'Balance Factor: \`BF = height(left) - height(right)\`.',
      'AVL property violated when \`|BF| > 1\`.',
      'LL Rotation: Single Right Rotation on left-heavy node.',
      'RR Rotation: Single Left Rotation on right-heavy node.',
      'LR Rotation: Left rotate left child, then Right rotate parent.',
      'RL Rotation: Right rotate right child, then Left rotate parent.',
    ],
    theory: `### AVL Tree Rotations

| Imbalance Case | Violation Condition | Required Rotation |
|:---|:---|:---|
| **LL Case** | BF(node) = +2 and BF(left) >= 0 | Right Rotation on node |
| **RR Case** | BF(node) = -2 and BF(right) <= 0 | Left Rotation on node |
| **LR Case** | BF(node) = +2 and BF(left) = -1 | Left Rotate left child, Right Rotate node |
| **RL Case** | BF(node) = -2 and BF(right) = +1 | Right Rotate right child, Left Rotate node |`,
    cCode: `#include <stdio.h>
#include <stdlib.h>

struct AVLNode {
    int key, height;
    struct AVLNode *left, *right;
};

int max(int a, int b) { return a > b ? a : b; }
int height(struct AVLNode *n) { return n ? n->height : 0; }

struct AVLNode* rightRotate(struct AVLNode *y) {
    struct AVLNode *x = y->left;
    struct AVLNode *T2 = x->right;
    x->right = y;
    y->left = T2;
    y->height = max(height(y->left), height(y->right)) + 1;
    x->height = max(height(x->left), height(x->right)) + 1;
    return x;
}

int main() {
    printf("AVL Rotations guarantee O(log N) worst-case height\\n");
    return 0;
}`,
    visualizer: 'avl',
    mcqs: [
      {
        question: 'What is the allowable Balance Factor range for any node in an AVL tree?',
        options: ['{-1, 0, 1}', '{0, 1, 2}', '{-2, 0, 2}', 'Any value <= log N'],
        correctIndex: 0,
        explanation: 'An AVL tree strictly requires BF = height(left) - height(right) to be either -1, 0, or +1.',
      },
    ],
  },
  {
    id: 'u4-b-trees',
    unitId: 4,
    unitTitle: 'Trees And Hashing',
    title: 'B-Trees',
    slug: 'b-trees',
    category: 'Balanced Trees',
    description: 'Self-balancing multi-way search trees optimized for external disk storage, databases, and filesystem indexing.',
    timeComplexity: 'Search, Insert, Delete: O(log_M N)',
    spaceComplexity: 'O(N) with high branching factor M',
    realWorldAnalogy: 'A library card catalog where each drawer holds multiple alphabetized reference cards, minimizing walking trips.',
    keyPoints: [
      'Every node has at most M children and at least ceil(M/2) children (except root).',
      'All leaf nodes reside at the exact same depth.',
      'High branching factor M minimizes slow disk I/O seek operations in database engines (e.g., PostgreSQL, SQLite).',
    ],
    theory: `### B-Trees

A B-tree of order $M$ is a balanced search tree designed for systems reading large blocks of memory.
Because disk access is thousands of times slower than RAM, storing hundreds of keys per node reduces tree height to 3 or 4 levels.`,
    cCode: `#include <stdio.h>

// B-tree node structure of order M
#define M 4

struct BTreeNode {
    int keys[M - 1];
    struct BTreeNode *children[M];
    int numKeys;
    int isLeaf;
};

int main() {
    printf("B-Trees power database indexes using multi-key nodes\\n");
    return 0;
}`,
    mcqs: [
      {
        question: 'Why are B-Trees preferred over Binary Search Trees for disk-based database indexes?',
        options: [
          'They use less RAM',
          'Their high branching factor reduces tree height, minimizing disk I/O reads',
          'They avoid pointer variables',
          'They are faster to compile',
        ],
        correctIndex: 1,
        explanation: 'Fewer levels mean fewer disk sector reads, which are the primary performance bottleneck in databases.',
      },
    ],
  },
  {
    id: 'u4-heaps',
    unitId: 4,
    unitTitle: 'Trees And Hashing',
    title: 'Binary Heaps (Min & Max Heap)',
    slug: 'binary-heaps',
    category: 'Heaps',
    description: 'Complete binary tree satisfying heap-order property stored compactly in 1-indexed arrays without explicit pointers.',
    timeComplexity: 'BuildHeap: O(N), Insert: O(log N), ExtractMin/Max: O(log N)',
    spaceComplexity: 'O(N) contiguous array',
    realWorldAnalogy: 'A corporate chain of command: every manager must earn more than their direct subordinates.',
    keyPoints: [
      'Shape property: Complete binary tree (filled on all levels, left-justified at bottom).',
      'Heap property (Max-Heap): \`parent >= children\`. (Min-Heap): \`parent <= children\`.',
      'Array indexing (1-based): Parent(i) = i/2, Left(i) = 2i, Right(i) = 2i+1.',
      'Heapify-Down restores heap invariant after root removal in $O(\\log n)$.',
    ],
    theory: `### Binary Heap Representation in Array

Because a Binary Heap is a complete tree, pointers are unnecessary:
- Node at index $i$:
  - Left child: $2i$
  - Right child: $2i + 1$
  - Parent: $\\lfloor i/2 \\rfloor$`,
    cCode: `#include <stdio.h>

void heapify(int arr[], int n, int i) {
    int largest = i;
    int l = 2 * i + 1;
    int r = 2 * i + 2;

    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;

    if (largest != i) {
        int temp = arr[i]; arr[i] = arr[largest]; arr[largest] = temp;
        heapify(arr, n, largest);
    }
}

int main() {
    int arr[] = {4, 10, 3, 5, 1};
    int n = 5;
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
    printf("Max-heap root: %d\\n", arr[0]);
    return 0;
}`,
    visualizer: 'heap',
    mcqs: [
      {
        question: 'For a node stored at index i in a 1-indexed array representation of a binary heap, where is its left child?',
        options: ['i + 1', '2 * i', '2 * i + 1', 'i / 2'],
        correctIndex: 1,
        explanation: 'In 1-based indexing, the left child is always at 2*i and right child at 2*i + 1.',
      },
    ],
  },
  {
    id: 'u4-hashing-chaining',
    unitId: 4,
    unitTitle: 'Trees And Hashing',
    title: 'Hashing: Separate Chaining',
    slug: 'hashing-separate-chaining',
    category: 'Hashing',
    description: 'Resolving hash collisions by maintaining a linked list of entries at each hash table bucket.',
    timeComplexity: 'Average: O(1), Worst: O(N) when all keys hash to same slot',
    spaceComplexity: 'O(M + N) where M is table size and N is entries',
    realWorldAnalogy: 'Post office sorting boxes where letters bound for the same zip code are stacked together in that zip code box.',
    keyPoints: [
      'Hash function maps key to slot index: \`hash(k) = k % tableSize\`.',
      'Collisions occur when two distinct keys yield the same bucket index.',
      'Separate chaining stores a linked list at each table slot.',
      'Load factor $\\alpha = N / M$. If $\\alpha$ stays small ($< 0.75$), operations are $O(1)$ on average.',
    ],
    theory: `### Separate Chaining Hashing

Each bucket in the hash table points to the head of a linked list.
When key collisions occur, the new record is prepended to that bucket\'s chain in $O(1)$ time.`,
    cCode: `#include <stdio.h>
#include <stdlib.h>

#define TABLE_SIZE 7

struct Node {
    int key;
    struct Node *next;
};

struct Node *hashTable[TABLE_SIZE];

void insert(int key) {
    int idx = key % TABLE_SIZE;
    struct Node *newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->key = key;
    newNode->next = hashTable[idx];
    hashTable[idx] = newNode;
}

int main() {
    insert(10); // 10 % 7 = 3
    insert(17); // 17 % 7 = 3 (Collision resolved via chaining)
    printf("Slot 3 head: %d -> %d\\n", hashTable[3]->key, hashTable[3]->next->key);
    return 0;
}`,
    visualizer: 'hash-table',
    mcqs: [
      {
        question: 'What is the load factor alpha of a hash table with 100 buckets storing 75 elements?',
        options: ['1.33', '0.75', '75', '25'],
        correctIndex: 1,
        explanation: 'Load factor alpha = N / M = 75 / 100 = 0.75.',
      },
    ],
  },
  {
    id: 'u4-open-addressing',
    unitId: 4,
    unitTitle: 'Trees And Hashing',
    title: 'Open Addressing: Linear & Quadratic Probing',
    slug: 'open-addressing',
    category: 'Hashing',
    description: 'Collision resolution storing all keys directly in the table array using probing sequences: Linear (i) and Quadratic (i^2).',
    timeComplexity: 'O(1) average lookup when alpha < 0.5',
    spaceComplexity: 'O(M) contiguous array with tombstone markers',
    realWorldAnalogy: 'Parking lot: if your designated parking space is occupied, you drive to the next available space.',
    keyPoints: [
      'All elements reside directly within the array; no pointer chains.',
      'Linear Probing: \`h(k, i) = (h(k) + i) % M\` (suffers from Primary Clustering).',
      'Quadratic Probing: \`h(k, i) = (h(k) + c1*i + c2*i^2) % M\` (eliminates primary clustering, suffers from secondary clustering).',
      'Deleted slots must be marked with a "Tombstone" flag to avoid terminating searches prematurely.',
    ],
    theory: `### Open Addressing Probing Sequences

- **Linear Probing**: Searches consecutive slots ($+1, +2, +3...$). Creates primary clustering (contiguous occupied blocks).
- **Quadratic Probing**: Searches quadratic offsets ($+1^2, +2^2, +3^2...$). Spreads entries to avoid clustering.`,
    cCode: `#include <stdio.h>
#define SIZE 7
#define EMPTY -1

int table[SIZE];

void init() { for (int i = 0; i < SIZE; i++) table[i] = EMPTY; }

void insertLinear(int key) {
    int idx = key % SIZE;
    int i = 0;
    while (table[(idx + i) % SIZE] != EMPTY && i < SIZE) {
        i++; // Linear step
    }
    table[(idx + i) % SIZE] = key;
}

int main() {
    init();
    insertLinear(10); // idx 3
    insertLinear(17); // idx 3 collision -> moves to idx 4
    printf("Slot 3: %d, Slot 4: %d\\n", table[3], table[4]);
    return 0;
}`,
    visualizer: 'hash-table',
    mcqs: [
      {
        question: 'What is Primary Clustering in Hashing?',
        options: [
          'All keys hashing to zero',
          'Tendency for linear probing to build long contiguous runs of occupied slots, worsening collision rates',
          'Memory leaks in chaining',
          'Double hashing collision',
        ],
        correctIndex: 1,
        explanation: 'Linear probing clumps occupied slots into clusters, drastically increasing probe lengths for new insertions.',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // UNIT 5: Graphs
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'u5-bfs-dfs',
    unitId: 5,
    unitTitle: 'Graphs',
    title: 'Graph Traversals: BFS & DFS',
    slug: 'bfs-dfs',
    category: 'Graph Algorithms',
    description: 'Breadth-First Search (FIFO queue, shortest unweighted paths) and Depth-First Search (recursive stack, cycle detection).',
    timeComplexity: 'O(V + E) with Adjacency List',
    spaceComplexity: 'O(V) visited array and queue/stack',
    realWorldAnalogy: 'BFS is ripples spreading across a pond layer by layer; DFS is navigating a maze following one path to its dead end.',
    keyPoints: [
      'BFS uses a FIFO Queue: Explores all k-distance neighbors before advancing to k+1.',
      'DFS uses a LIFO Stack or Recursion: Explores as deep as possible along each branch before backtracking.',
      'A visited boolean array is mandatory to prevent infinite loops in cyclic graphs.',
    ],
    theory: `### BFS and DFS Graph Traversals

Given graph $G = (V, E)$:
- **BFS**: Guarantees shortest path in unweighted graphs.
- **DFS**: Produces DFS tree, discovers back-edges (cycles), and computes topological orderings.`,
    cCode: `#include <stdio.h>
#include <stdbool.h>

#define V 4
int adj[V][V] = {
    {0, 1, 1, 0},
    {1, 0, 0, 1},
    {1, 0, 0, 1},
    {0, 1, 1, 0}
};

void bfs(int start) {
    bool visited[V] = {false};
    int queue[V], front = 0, rear = 0;

    visited[start] = true;
    queue[rear++] = start;

    printf("BFS Order: ");
    while (front < rear) {
        int u = queue[front++];
        printf("%d ", u);
        for (int v = 0; v < V; v++) {
            if (adj[u][v] && !visited[v]) {
                visited[v] = true;
                queue[rear++] = v;
            }
        }
    }
    printf("\\n");
}

int main() {
    bfs(0);
    return 0;
}`,
    visualizer: 'graph',
    mcqs: [
      {
        question: 'Which data structure is fundamentally used to implement Breadth-First Search (BFS)?',
        options: ['Stack', 'FIFO Queue', 'Priority Queue', 'Binary Tree'],
        correctIndex: 1,
        explanation: 'BFS uses a FIFO queue to visit vertices in increasing order of their distance from the source vertex.',
      },
    ],
  },
  {
    id: 'u5-topological-sorting',
    unitId: 5,
    unitTitle: 'Graphs',
    title: 'Topological Sorting',
    slug: 'topological-sorting',
    category: 'Graph Algorithms',
    description: 'Linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, u appears before v.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V) in-degree array and queue',
    realWorldAnalogy: 'University course prerequisite flowchart: you must pass Math 101 before enrolling in Math 201.',
    keyPoints: [
      'Only valid for Directed Acyclic Graphs (DAGs); fails if cycles exist.',
      'Kahn\'s Algorithm: Compute in-degree of all vertices; enqueue in-degree 0; dequeue, output, and decrement neighbor in-degrees.',
      'If output vertex count < V, graph contains a directed cycle.',
    ],
    theory: `### Topological Sorting (Kahn\'s Algorithm)

1. Compute in-degree for every vertex.
2. Enqueue all vertices with in-degree = 0.
3. While queue is non-empty:
   - Dequeue $u$, append to result list.
   - For each neighbor $v$ of $u$: decrement in-degree of $v$. If in-degree becomes 0, enqueue $v$.
4. If result list length $\\neq |V|$, a cycle exists.`,
    cCode: `#include <stdio.h>

int main() {
    printf("Topological sort resolves task scheduling dependencies in O(V + E)\\n");
    return 0;
}`,
    visualizer: 'graph',
    mcqs: [
      {
        question: 'Which kind of graph can have a topological sort?',
        options: [
          'Any directed graph',
          'Undirected cyclic graphs',
          'Directed Acyclic Graphs (DAGs) only',
          'Complete graphs only',
        ],
        correctIndex: 2,
        explanation: 'A topological sort is mathematically possible if and only if the graph has directed edges and no cycles (DAG).',
      },
    ],
  },
  {
    id: 'u5-prims-algorithm',
    unitId: 5,
    unitTitle: 'Graphs',
    title: 'Prim\'s Algorithm (Minimum Spanning Tree)',
    slug: 'prims-algorithm',
    category: 'Spanning Trees',
    description: 'Greedy algorithm growing a Minimum Spanning Tree from an initial vertex by repeatedly adding the cheapest edge connecting to the unvisited set.',
    timeComplexity: 'Adjacency Matrix: O(V^2), Min-Heap: O(E log V)',
    spaceComplexity: 'O(V) key and parent arrays',
    realWorldAnalogy: 'Laying fiber optic cable to connect a city: start at central exchange and always connect the closest unconnected building.',
    keyPoints: [
      'A Minimum Spanning Tree (MST) connects all V vertices with V-1 edges of minimum total weight.',
      'Prim\'s grows a single tree vertex by vertex.',
      'Greedy choice: pick minimum weight cut-edge crossing from visited set to unvisited set.',
    ],
    theory: `### Prim\'s MST Algorithm

1. Maintain sets: $MST$ and $NonMST$.
2. Assign key value $\\infty$ to all vertices; set key[source] = 0.
3. While $MST \\neq V$:
   - Pick $u \\in NonMST$ with minimum key value.
   - Include $u$ into $MST$.
   - For every neighbor $v$ of $u$: if weight($u, v$) < key[$v$], update key[$v$] = weight($u, v$).`,
    cCode: `#include <stdio.h>
#include <stdbool.h>

#define V 5
#define INF 999999

int minKey(int key[], bool mstSet[]) {
    int min = INF, min_idx = -1;
    for (int v = 0; v < V; v++) {
        if (!mstSet[v] && key[v] < min) {
            min = key[v]; min_idx = v;
        }
    }
    return min_idx;
}

int main() {
    printf("Prim's algorithm builds MST edge by edge from an initial node\\n");
    return 0;
}`,
    visualizer: 'graph',
    mcqs: [
      {
        question: 'How many edges are present in a Minimum Spanning Tree of a connected graph with V vertices?',
        options: ['V', 'V - 1', 'V + 1', 'E / 2'],
        correctIndex: 1,
        explanation: 'Any spanning tree on V vertices must contain exactly V - 1 edges without cycles.',
      },
    ],
  },
  {
    id: 'u5-kruskals-algorithm',
    unitId: 5,
    unitTitle: 'Graphs',
    title: 'Kruskal\'s Algorithm (MST & Union-Find)',
    slug: 'kruskals-algorithm',
    category: 'Spanning Trees',
    description: 'Greedy edge-centric MST algorithm: sorts all edges by weight and adds edges if they do not create a cycle using Disjoint Set Union (DSU).',
    timeComplexity: 'O(E log E) or O(E log V) dominated by sorting edges',
    spaceComplexity: 'O(V + E) for edge list and DSU parent array',
    realWorldAnalogy: 'Connecting regional electrical power grids: build cheapest transmission lines first, ignoring geography unless they close a redundant loop.',
    keyPoints: [
      'Edge-centric algorithm: sorts all graph edges by weight in ascending order.',
      'Uses Disjoint Set Union (DSU / Union-Find) with path compression and rank optimization.',
      'Add edge (u, v) if \`Find(u) != Find(v)\`; then \`Union(u, v)\`. Stop after V-1 edges.',
    ],
    theory: `### Kruskal\'s Algorithm with Disjoint Set Union (DSU)

1. Sort all edges in non-decreasing order of weight.
2. Initialize each vertex in its own disjoint set: \`parent[i] = i\`.
3. For each edge $(u, v)$ with weight $w$:
   - If \`Find(u) != Find(v)\`: include edge in MST, perform \`Union(u, v)\`.
   - If \`Find(u) == Find(v)\`: discard edge (would create cycle).
4. Terminate when MST contains $V - 1$ edges.`,
    cCode: `#include <stdio.h>
#include <stdlib.h>

struct Edge { int src, dest, weight; };

int find(int parent[], int i) {
    if (parent[i] == i) return i;
    return parent[i] = find(parent, parent[i]); // Path compression
}

void unionSets(int parent[], int rank[], int x, int y) {
    int rootX = find(parent, x);
    int rootY = find(parent, y);
    if (rank[rootX] < rank[rootY]) parent[rootX] = rootY;
    else if (rank[rootX] > rank[rootY]) parent[rootY] = rootX;
    else { parent[rootY] = rootX; rank[rootX]++; }
}

int main() {
    printf("Kruskal's algorithm with DSU selects minimum valid edges\\n");
    return 0;
}`,
    visualizer: 'graph',
    mcqs: [
      {
        question: 'Which data structure allows Kruskal\'s algorithm to efficiently check if adding an edge creates a cycle?',
        options: ['Binary Search Tree', 'Disjoint Set Union (Union-Find)', 'Stack', 'Linked List'],
        correctIndex: 1,
        explanation: 'DSU with path compression determines whether two vertices belong to the same connected component in nearly O(1) time.',
      },
    ],
  },
  {
    id: 'u5-dijkstras-algorithm',
    unitId: 5,
    unitTitle: 'Graphs',
    title: 'Dijkstra\'s Shortest Path Algorithm',
    slug: 'dijkstras-algorithm',
    category: 'Shortest Path',
    description: 'Single-source shortest path algorithm on non-negative weighted graphs using edge relaxation and priority queues.',
    timeComplexity: 'Min-Heap: O((V + E) log V)',
    spaceComplexity: 'O(V) distances and priority queue',
    realWorldAnalogy: 'Google Maps calculating fastest GPS driving route from your current location to all destinations in a road network.',
    keyPoints: [
      'Finds shortest path from source vertex to ALL other vertices.',
      'Edge relaxation formula: \`if (dist[u] + weight(u, v) < dist[v]) dist[v] = dist[u] + weight(u, v)\`.',
      'Fails on graphs with negative edge weights (requires Bellman-Ford instead).',
      'Uses greedy principle: the vertex with minimum tentative distance is settled permanently.',
    ],
    theory: `### Dijkstra\'s Algorithm

1. Set \`dist[src] = 0\` and \`dist[v] = infinity\` for all other vertices.
2. Insert \`(0, src)\` into Min-Priority Queue.
3. While queue is not empty:
   - Extract vertex $u$ with minimum distance.
   - For each neighbor $v$ of $u$ with edge weight $w$:
     - If \`dist[u] + w < dist[v]\`:
       - \`dist[v] = dist[u] + w\`
       - Push \`(dist[v], v)\` into priority queue.`,
    cCode: `#include <stdio.h>
#include <stdbool.h>

#define V 5
#define INF 999999

int minDistance(int dist[], bool sptSet[]) {
    int min = INF, min_idx = -1;
    for (int v = 0; v < V; v++) {
        if (!sptSet[v] && dist[v] <= min) {
            min = dist[v]; min_idx = v;
        }
    }
    return min_idx;
}

int main() {
    printf("Dijkstra's finds single-source shortest path in non-negative graphs\\n");
    return 0;
}`,
    visualizer: 'graph',
    mcqs: [
      {
        question: 'Under what condition does Dijkstra\'s algorithm produce incorrect shortest path results?',
        options: [
          'If the graph contains cycles',
          'If the graph contains negative edge weights',
          'If the graph is directed',
          'If the graph has more than 100 vertices',
        ],
        correctIndex: 1,
        explanation: 'Dijkstra\'s greedy choice assumes paths only increase in weight; negative edges violate this assumption.',
      },
    ],
  },
];
