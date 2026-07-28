import { DsaAlgorithm } from '../types';

export const CPP_ALGORITHMS: DsaAlgorithm[] = [
  {
    id: 'stack',
    title: '1. Stack (Call Stack Unwinding)',
    subtitle: 'Simulate runtime call stack frame unwinding on crash exception',
    cppFileName: 'StackSimulation.cpp',
    timeComplexity: 'O(N) Push / Pop',
    spaceComplexity: 'O(N) Depth',
    useCase: 'Reconstruct call stack frame execution paths leading up to the exact crash instruction line.',
    code: `#include <iostream>
#include <stack>
#include <string>
#include <vector>

class CrashCallStack {
private:
    std::stack<std::string> callStack;

public:
    void pushFrame(const std::string& methodSignature) {
        callStack.push(methodSignature);
        std::cout << "[PUSH] Frame added: " << methodSignature << std::endl;
    }

    void unwindStack() {
        std::cout << "\n--- CRASH OCCURRED: UNWINDING CALL STACK ---" << std::endl;
        int frameNum = 1;
        while (!callStack.empty()) {
            std::cout << "Frame #" << frameNum++ << ": " << callStack.top() << std::endl;
            callStack.pop();
        }
    }
};

int main() {
    CrashCallStack tracker;
    tracker.pushFrame("main()");
    tracker.pushFrame("com.crashlens.login.LoginViewModel.onLoginClick()");
    tracker.pushFrame("com.crashlens.login.LoginRepository.verifyToken()");
    tracker.pushFrame("com.crashlens.network.ApiClient.attachHeaders()"); // Exception line!
    
    tracker.unwindStack();
    return 0;
}`
  },
  {
    id: 'hashmap',
    title: '2. Hash Map (Exception Frequency)',
    subtitle: 'O(1) exception frequency aggregation and lookup table',
    cppFileName: 'HashFrequency.cpp',
    timeComplexity: 'O(1) Avg Lookup/Insert',
    spaceComplexity: 'O(U) Unique Exceptions',
    useCase: 'Aggregate incoming crash types into counts instantly to prioritize fix releases.',
    code: `#include <iostream>
#include <unordered_map>
#include <string>
#include <vector>

class ExceptionFrequencyTracker {
private:
    std::unordered_map<std::string, int> freqMap;

public:
    void recordException(const std::string& exceptionType) {
        freqMap[exceptionType]++;
    }

    int getFrequency(const std::string& exceptionType) const {
        auto it = freqMap.find(exceptionType);
        return (it != freqMap.end()) ? it->second : 0;
    }

    void displayReport() const {
        std::cout << "--- EXCEPTION FREQUENCY REPORT ---" << std::endl;
        for (const auto& pair : freqMap) {
            std::cout << pair.first << " : " << pair.second << " occurrences" << std::endl;
        }
    }
};

int main() {
    ExceptionFrequencyTracker tracker;
    tracker.recordException("NullPointerException");
    tracker.recordException("OutOfMemoryError");
    tracker.recordException("NullPointerException");
    tracker.recordException("ANR");
    tracker.recordException("NullPointerException");

    tracker.displayReport();
    return 0;
}`
  },
  {
    id: 'graph',
    title: '3. Graph & DFS (Dangerous Path Finding)',
    subtitle: 'Graph transition analysis finding screen navigation crash sequences',
    cppFileName: 'GraphCrash.cpp',
    timeComplexity: 'O(V + E) DFS Traversal',
    spaceComplexity: 'O(V) Recursion Stack',
    useCase: 'Identify the exact sequence of user screen navigation steps that triggers critical crashes.',
    code: `#include <iostream>
#include <vector>
#include <unordered_map>
#include <string>

class ScreenGraph {
private:
    std::unordered_map<std::string, std::vector<std::string>> adjList;

public:
    void addTransition(const std::string& fromScreen, const std::string& toScreen) {
        adjList[fromScreen].push_back(toScreen);
    }

    void dfsFindDangerousPath(const std::string& current, const std::string& targetCrash, 
                              std::vector<std::string>& path, std::vector<std::string>& result) {
        path.push_back(current);
        if (current == targetCrash) {
            result = path;
            return;
        }

        for (const auto& neighbor : adjList[current]) {
            dfsFindDangerousPath(neighbor, targetCrash, path, result);
            if (!result.empty()) return;
        }
        path.pop_back();
    }
};

int main() {
    ScreenGraph appGraph;
    appGraph.addTransition("HomeScreen", "LoginScreen");
    appGraph.addTransition("LoginScreen", "PaymentCheckout");
    appGraph.addTransition("PaymentCheckout", "CrashState");

    std::vector<std::string> currentPath, resultPath;
    appGraph.dfsFindDangerousPath("HomeScreen", "CrashState", currentPath, resultPath);

    std::cout << "Most Dangerous Screen Path: ";
    for (size_t i = 0; i < resultPath.size(); ++i) {
        std::cout << resultPath[i] << (i + 1 < resultPath.size() ? " -> " : "\n");
    }
    return 0;
}`
  },
  {
    id: 'trie',
    title: '4. Trie (Fast Stack Trace Prefix Search)',
    subtitle: 'O(L) prefix search tree through millions of stack trace tokens',
    cppFileName: 'TrieSearch.cpp',
    timeComplexity: 'O(L) where L = Prefix Length',
    spaceComplexity: 'O(N * L) Nodes',
    useCase: 'Autocomplete and search stack traces instantly across millions of historical log items.',
    code: `#include <iostream>
#include <unordered_map>
#include <string>
#include <vector>

struct TrieNode {
    std::unordered_map<char, TrieNode*> children;
    bool isEndOfWord = false;
    int crashCount = 0;
};

class StackTraceTrie {
private:
    TrieNode* root;

public:
    StackTraceTrie() { root = new TrieNode(); }

    void insert(const std::string& trace) {
        TrieNode* curr = root;
        for (char ch : trace) {
            if (curr->children.find(ch) == curr->children.end()) {
                curr->children[ch] = new TrieNode();
            }
            curr = curr->children[ch];
        }
        curr->isEndOfWord = true;
        curr->crashCount++;
    }

    bool searchPrefix(const std::string& prefix) {
        TrieNode* curr = root;
        for (char ch : prefix) {
            if (curr->children.find(ch) == curr->children.end()) return false;
            curr = curr->children[ch];
        }
        return true;
    }
};

int main() {
    StackTraceTrie trie;
    trie.insert("NullPointerException");
    trie.insert("NullPointerAccess");

    std::cout << "Search 'NullPointer': " << (trie.searchPrefix("NullPointer") ? "FOUND" : "NOT FOUND") << std::endl;
    return 0;
}`
  },
  {
    id: 'heap',
    title: '5. Priority Queue / Heap (Top K Frequent Crashes)',
    subtitle: 'Min-Heap maintaining top K highest severity/frequent crash items',
    cppFileName: 'HeapTopCrash.cpp',
    timeComplexity: 'O(N log K) Min-Heap',
    spaceComplexity: 'O(K) Heap Size',
    useCase: 'Dynamically track the top 10 most critical crashes in real-time without sorting full DB.',
    code: `#include <iostream>
#include <queue>
#include <string>
#include <vector>

struct CrashItem {
    std::string name;
    int frequency;

    // Min-heap comparator based on frequency
    bool operator>(const CrashItem& other) const {
        return frequency > other.frequency;
    }
};

class TopCrashHeap {
private:
    std::priority_queue<CrashItem, std::vector<CrashItem>, std::greater<CrashItem>> minHeap;
    int k;

public:
    TopCrashHeap(int topK) : k(topK) {}

    void addCrash(const std::string& name, int freq) {
        minHeap.push({name, freq});
        if (minHeap.size() > k) {
            minHeap.pop(); // Remove smallest frequency
        }
    }

    void displayTopK() {
        std::cout << "Top " << k << " Most Frequent Crashes:\n";
        while (!minHeap.empty()) {
            CrashItem item = minHeap.top();
            minHeap.pop();
            std::cout << "- " << item.name << " (" << item.frequency << " occurrences)\n";
        }
    }
};

int main() {
    TopCrashHeap heap(3);
    heap.addCrash("NullPointerException", 245);
    heap.addCrash("OutOfMemoryError", 189);
    heap.addCrash("IndexOutOfBoundsException", 92);
    heap.addCrash("ANR", 310);

    heap.displayTopK();
    return 0;
}`
  },
  {
    id: 'queue',
    title: '6. Queue (FIFO Crash Ingestion Buffer)',
    subtitle: 'Sequential first-in-first-out non-blocking crash log buffer',
    cppFileName: 'QueueBuffer.cpp',
    timeComplexity: 'O(1) Enqueue / Dequeue',
    spaceComplexity: 'O(N) Buffer Capacity',
    useCase: 'Buffer incoming client crash logs from mobile devices during high-traffic surges.',
    code: `#include <iostream>
#include <queue>
#include <string>

struct CrashPacket {
    std::string crashId;
    std::string payload;
};

class CrashIngestionBuffer {
private:
    std::queue<CrashPacket> buffer;

public:
    void enqueue(const std::string& id, const std::string& payload) {
        buffer.push({id, payload});
        std::cout << "[ENQUEUE] Crash " << id << " added to ingestion queue." << std::endl;
    }

    void processNext() {
        if (!buffer.empty()) {
            CrashPacket packet = buffer.front();
            buffer.pop();
            std::cout << "[PROCESS] DB Ingesting Crash " << packet.crashId << std::endl;
        } else {
            std::cout << "Buffer empty." << std::endl;
        }
    }
};

int main() {
    CrashIngestionBuffer q;
    q.enqueue("CRASH-9001", "NullPointerException in Login");
    q.enqueue("CRASH-9002", "OutOfMemoryError in Camera");

    q.processNext();
    q.processNext();
    return 0;
}`
  },
  {
    id: 'binary_search',
    title: '7. Binary Search (Fast Crash ID Lookup)',
    subtitle: 'O(log N) lookup across sorted array of millions of crash records',
    cppFileName: 'BinarySearch.cpp',
    timeComplexity: 'O(log N)',
    spaceComplexity: 'O(1)',
    useCase: 'Locate specific crash IDs instantly from pre-sorted timestamp index tables.',
    code: `#include <iostream>
#include <vector>
#include <algorithm>
#include <string>

int binarySearchCrash(const std::vector<std::string>& sortedCrashIds, const std::string& targetId) {
    int low = 0;
    int high = sortedCrashIds.size() - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (sortedCrashIds[mid] == targetId) return mid;
        if (sortedCrashIds[mid] < targetId) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}

int main() {
    std::vector<std::string> crashIds = {"CRASH-9001", "CRASH-9002", "CRASH-9003", "CRASH-9004", "CRASH-9005"};
    std::string target = "CRASH-9003";

    int index = binarySearchCrash(crashIds, target);
    std::cout << "Crash " << target << " found at index: " << index << std::endl;
    return 0;
}`
  },
  {
    id: 'segment_tree',
    title: '8. Segment Tree (Time Range Crash Count Query)',
    subtitle: 'O(log N) range query counting crashes between dynamic time intervals',
    cppFileName: 'SegmentTreeRange.cpp',
    timeComplexity: 'O(log N) Range Query',
    spaceComplexity: 'O(4N) Tree Space',
    useCase: 'Answer instantaneous queries like "How many crashes occurred between 14:00 and 16:00?"',
    code: `#include <iostream>
#include <vector>

class CrashSegmentTree {
private:
    std::vector<int> tree;
    int n;

    void buildTree(const std::vector<int>& arr, int node, int start, int end) {
        if (start == end) {
            tree[node] = arr[start];
            return;
        }
        int mid = (start + end) / 2;
        buildTree(arr, 2 * node, start, mid);
        buildTree(arr, 2 * node + 1, mid + 1, end);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    int queryRange(int node, int start, int end, int l, int r) {
        if (r < start || end < l) return 0; // Out of bounds
        if (l <= start && end <= r) return tree[node]; // Completely inside
        int mid = (start + end) / 2;
        return queryRange(2 * node, start, mid, l, r) + queryRange(2 * node + 1, mid + 1, end, l, r);
    }

public:
    CrashSegmentTree(const std::vector<int>& hourlyCrashes) {
        n = hourlyCrashes.size();
        tree.resize(4 * n, 0);
        buildTree(hourlyCrashes, 1, 0, n - 1);
    }

    int query(int startHour, int endHour) {
        return queryRange(1, 0, n - 1, startHour, endHour);
    }
};

int main() {
    // Hourly crash counts for 24 hours (00:00 to 23:00)
    std::vector<int> hourlyCrashes = {5, 2, 1, 0, 0, 3, 12, 45, 80, 95, 110, 130, 140, 150, 160, 120, 90, 70, 50, 30, 20, 15, 10, 6};
    CrashSegmentTree st(hourlyCrashes);

    int count = st.query(14, 16); // Crashes between 14:00 (2PM) and 16:00 (4PM)
    std::cout << "Total crashes between 14:00 and 16:00: " << count << std::endl;
    return 0;
}`
  }
];
