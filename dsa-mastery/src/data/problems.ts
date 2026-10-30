// ============================================================================
// DSA Mastery - Practice Problems Dataset
// Comprehensive coding problems across Easy, Medium, Hard categories
// ============================================================================

export interface Problem {
  id: string;
  title: string;
  slug: string;
  unitId: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  starterCode: string;
  solutionCode: string;
  hints: string[];
  testCases: {
    input: string;
    expected: string;
  }[];
}

export const PROBLEMS: Problem[] = [
  {
    id: 'p-reverse-array',
    title: 'Reverse an Array in Place',
    slug: 'reverse-array',
    unitId: 1,
    difficulty: 'Easy',
    category: 'Arrays',
    description: 'Given an array of integers, reverse the array in place without allocating extra auxiliary array storage.',
    inputFormat: 'First line contains integer N. Second line contains N space-separated integers.',
    outputFormat: 'Print the reversed array elements separated by spaces.',
    constraints: ['1 <= N <= 10^5', '-10^9 <= arr[i] <= 10^9'],
    examples: [
      { input: '5\n1 2 3 4 5', output: '5 4 3 2 1', explanation: 'Elements are reversed from ends to center.' }
    ],
    starterCode: `#include <stdio.h>

void reverseArray(int arr[], int n) {
    // Write your in-place reversal logic here
}

int main() {
    int arr[] = {1, 2, 3, 4, 5};
    int n = 5;
    reverseArray(arr, n);
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    return 0;
}`,
    solutionCode: `#include <stdio.h>

void reverseArray(int arr[], int n) {
    int left = 0, right = n - 1;
    while (left < right) {
        int temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;
        left++;
        right--;
    }
}

int main() {
    int arr[] = {1, 2, 3, 4, 5};
    int n = 5;
    reverseArray(arr, n);
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    return 0;
}`,
    hints: [
      'Think about two pointers: one at the start, one at the end.',
      'Swap the elements at both pointers and move inward until they meet.'
    ],
    testCases: [
      { input: '4\n10 20 30 40', expected: '40 30 20 10' }
    ]
  },
  {
    id: 'p-detect-cycle-ll',
    title: 'Detect Cycle in a Linked List (Floyd\'s Algorithm)',
    slug: 'detect-cycle-linked-list',
    unitId: 2,
    difficulty: 'Medium',
    category: 'Linked Lists',
    description: 'Determine whether a given singly linked list contains a cycle using Floyd\'s Tortoise and Hare algorithm.',
    inputFormat: 'Linked list nodes with or without loop reference.',
    outputFormat: 'Return 1 if a cycle exists, 0 otherwise.',
    constraints: ['Node count 0 <= N <= 10^4', 'O(1) memory requirement'],
    examples: [
      { input: '3 -> 2 -> 0 -> -4 -> (loops to node 2)', output: '1', explanation: 'A cycle exists connecting node -4 back to node 2.' }
    ],
    starterCode: `#include <stdio.h>
#include <stdbool.h>

struct ListNode {
    int val;
    struct ListNode *next;
};

bool hasCycle(struct ListNode *head) {
    // Implement Floyd's cycle-finding algorithm
    return false;
}`,
    solutionCode: `#include <stdio.h>
#include <stdbool.h>

struct ListNode {
    int val;
    struct ListNode *next;
};

bool hasCycle(struct ListNode *head) {
    if (!head || !head->next) return false;
    struct ListNode *slow = head;
    struct ListNode *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}`,
    hints: [
      'Use two pointers moving at different speeds (slow moves 1 step, fast moves 2 steps).',
      'If there is a cycle, the faster pointer will eventually lap the slower pointer.'
    ],
    testCases: [
      { input: '1 -> 2 -> 1', expected: '1' }
    ]
  },
  {
    id: 'p-valid-parentheses',
    title: 'Balanced Parentheses Validation',
    slug: 'valid-parentheses',
    unitId: 3,
    difficulty: 'Easy',
    category: 'Stacks',
    description: 'Given a string containing only characters \'(\', \')\', \'{\', \'}\', \'[\', \']\', determine if the input string is valid.',
    inputFormat: 'Single string s.',
    outputFormat: 'Print 1 if valid, 0 if invalid.',
    constraints: ['1 <= s.length <= 10^4'],
    examples: [
      { input: '()[]{}', output: '1', explanation: 'All brackets close in proper pairs.' },
      { input: '(]', output: '0', explanation: 'Mismatched closing bracket.' }
    ],
    starterCode: `#include <stdio.h>
#include <stdbool.h>

bool isValid(char* s) {
    // Write your stack validation code here
    return false;
}`,
    solutionCode: `#include <stdio.h>
#include <stdbool.h>

bool isValid(char* s) {
    char stack[10000];
    int top = -1;
    for (int i = 0; s[i]; i++) {
        char c = s[i];
        if (c == '(' || c == '[' || c == '{') stack[++top] = c;
        else {
            if (top == -1) return false;
            char open = stack[top--];
            if (c == ')' && open != '(') return false;
            if (c == ']' && open != '[') return false;
            if (c == '}' && open != '{') return false;
        }
    }
    return top == -1;
}`,
    hints: [
      'Push opening brackets onto a stack.',
      'When you see a closing bracket, check whether the top of the stack matches.'
    ],
    testCases: [
      { input: '{[()]}', expected: '1' },
      { input: '{[(])}', expected: '0' }
    ]
  },
  {
    id: 'p-lowest-common-ancestor',
    title: 'Lowest Common Ancestor in BST',
    slug: 'lowest-common-ancestor-bst',
    unitId: 4,
    difficulty: 'Medium',
    category: 'Trees',
    description: 'Given a Binary Search Tree (BST), find the lowest common ancestor (LCA) node of two given nodes p and q.',
    inputFormat: 'BST root pointer and values p, q.',
    outputFormat: 'Value of the LCA node.',
    constraints: ['All node values are unique.', 'p and q exist in the BST.'],
    examples: [
      { input: 'BST: [6,2,8,0,4,7,9], p=2, q=8', output: '6', explanation: 'LCA of 2 and 8 is 6.' }
    ],
    starterCode: `#include <stdio.h>

struct TreeNode {
    int val;
    struct TreeNode *left;
    struct TreeNode *right;
};

struct TreeNode* lowestCommonAncestor(struct TreeNode* root, int p, int q) {
    // Utilize BST property to locate LCA in O(H) time
    return NULL;
}`,
    solutionCode: `#include <stdio.h>

struct TreeNode {
    int val;
    struct TreeNode *left;
    struct TreeNode *right;
};

struct TreeNode* lowestCommonAncestor(struct TreeNode* root, int p, int q) {
    while (root) {
        if (p < root->val && q < root->val) root = root->left;
        else if (p > root->val && q > root->val) root = root->right;
        else return root;
    }
    return NULL;
}`,
    hints: [
      'Leverage the BST ordering property: left < root < right.',
      'If both p and q are smaller than root, LCA is in left subtree; if both greater, in right subtree.'
    ],
    testCases: [
      { input: 'p=2, q=4', expected: '2' }
    ]
  },
  {
    id: 'p-shortest-path-dijkstra',
    title: 'Dijkstra Shortest Path Implementation',
    slug: 'shortest-path-dijkstra',
    unitId: 5,
    difficulty: 'Hard',
    category: 'Graphs',
    description: 'Given a non-negative weighted adjacency matrix and a source vertex, compute the shortest distance to all other vertices.',
    inputFormat: 'V vertices, adjacency matrix, source node S.',
    outputFormat: 'Array of shortest distances from S.',
    constraints: ['1 <= V <= 500', 'Edge weights >= 0'],
    examples: [
      { input: 'V=4, Source=0', output: '0 4 1 3' }
    ],
    starterCode: `#include <stdio.h>

void dijkstra(int graph[4][4], int src) {
    // Implement Dijkstra's algorithm
}`,
    solutionCode: `#include <stdio.h>
#include <stdbool.h>

#define V 4
#define INF 999999

void dijkstra(int graph[V][V], int src) {
    int dist[V];
    bool visited[V] = {false};
    for (int i = 0; i < V; i++) dist[i] = INF;
    dist[src] = 0;

    for (int count = 0; count < V - 1; count++) {
        int min = INF, u = -1;
        for (int v = 0; v < V; v++) {
            if (!visited[v] && dist[v] <= min) {
                min = dist[v]; u = v;
            }
        }
        if (u == -1) break;
        visited[u] = true;
        for (int v = 0; v < V; v++) {
            if (!visited[v] && graph[u][v] && dist[u] != INF && dist[u] + graph[u][v] < dist[v]) {
                dist[v] = dist[u] + graph[u][v];
            }
        }
    }

    for (int i = 0; i < V; i++) printf("%d ", dist[i]);
}`,
    hints: [
      'Maintain an array of tentative distances initialized to INF except source at 0.',
      'Greedily choose the unvisited vertex with smallest tentative distance and relax its neighbors.'
    ],
    testCases: [
      { input: 'Source 0', expected: '0 4 1 3' }
    ]
  }
];
