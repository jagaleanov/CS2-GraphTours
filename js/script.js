// JavaScript Document

class Node {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
    }
}

class Graph {
    constructor() {
        this.nodesList = [];
        this.edgesList = [];
        this.nodeCounter = 0;
        this.addedList = [];
        this.tree;
    }

    insertNode(x, y) {
        this.nodeCounter++;
        let newNode = new Node(this.nodeCounter, x, y);
        this.nodesList[this.nodeCounter] = newNode;
    }

    insertEdge(from, to) {
        if (!Array.isArray(this.edgesList[from])) {
            this.edgesList[from] = [];
        }
        this.edgesList[from].push(to);
    }

    widthTourFrom(id) {
        this.addedList = [];
        this.tree = new Tree();

        let addedList = [id];

        let queue = new Queue();
        queue.enqueue(id);
        this.tree.addWord([id]);


        while (!queue.isEmpty()) {

            let parentNode = queue.dequeue(); // mutates the queue
            let children = this.edgesList[parentNode];

            for (let i = 0; i < children.length; i++) {

                if (addedList.indexOf(children[i]) == -1) {
                    addedList.push(children[i]);
                    queue.enqueue(children[i]);

                    let word = this.tree.findNode(this.tree.head, parentNode);
                    word.reverse();
                    word.shift();
                    word.push(children[i]);
                    this.tree.addWord(word);
                }
            }
        }
        return this.tree.getMatrixHTML();
    }


    depthTourFrom(id, word = "") {
        id = Number.parseInt(id);
        word += String(id);
        if (this.addedList.length == 0) {
            this.tree.addWord(word);
            this.addedList.push(id);
        }
        if (Array.isArray(this.edgesList[id])) {

            for (let j = 0; j < this.edgesList[id].length; j++) {

                if (this.addedList.indexOf(this.edgesList[id][j]) == -1) {
                    this.tree.addWord(word + this.edgesList[id][j]);
                    this.addedList.push(this.edgesList[id][j]);

                    this.depthTourFrom(this.edgesList[id][j], word);
                }

            }
        }
        return this.tree.getMatrixHTML();
    }
}

class TreeNode {
    value;
    parent;
    type;
    right;
    down;

    constructor(value) {
        this.value = value;
        this.parent = null;
        this.type = null;
        this.right = null;
        this.down = null;
    }
}

class Tree {

    head;
    tableData;
    lineCounter;
    wordsList;
    preOrder = '';
    inOrder = '';
    posOrder = '';

    constructor() {

        this.head = new TreeNode(null);
        this.head.down = new TreeNode('}');
        this.tableData = [[]];
        this.lineCounter = 0;
        this.wordsList = [];
        this.treeToMatrix(this.head);
        this.completeMatrix();
    }

    findNode(head, id) {
        if (head.value == id) {
            return [id];
        } else {
            let node = head.down;
            //wordIni.push(parseInt(head.value));
            while (node != null) {
                let res = this.findNode(node, id);
                if (res != false) {
                    res.push((parseInt(head.value)));
                    return res;
                }
                node = node.right;
            }
            return false;
        }
    }

    //ADD TO TREE
    addRight(head, num) {
        if (head != null) {

            //if (head.value == '}' || head.value.charCodeAt(0) > num.charCodeAt(0)) {
            if (head.value == '}' || head.value > num) {
                let newNode = new TreeNode(num);
                head.parent = newNode;
                head.type = 1;
                newNode.right = head;
                return newNode;
            } else {
                let node = head;
                //while (node.right != null && node.right.value.charCodeAt(0) < num.charCodeAt(0)) {
                while (node.right != null && node.right.value < num) {
                    node = node.right;
                }
                let newNode = new TreeNode(num);
                if (newNode.right != null) {
                    node.right.parent = newNode;
                    node.right.type = 1;
                }
                newNode.right = node.right;
                node.right = newNode;
                newNode.parent = node;
                newNode.type = 1;
                return head;
            }
        } else {
            return new TreeNode(num);
        }
    }

    addWordRecursive(head, word) {
        if (word.length == 0) {//si acabo la palabra
            head.down = this.addRight(head.down, '}');
            head.down.parent = head;
            head.down.type = 0;
        } else {
            let node = head.down;
            if (node == null) {//si no hay mas letras debajo
                //head.down = this.addRight(null, word.charAt(0));
                head.down = this.addRight(null, word[0]);
                head.down.parent = head;
                head.down.type = 0;
                head = this.addWordRecursive(head, word);
                //} else if (node.value == word.charAt(0)) {//si la letra de abajo coincide
            } else if (node.value == word[0]) {//si la letra de abajo coincide
                //node = this.addWordRecursive(node, word.substring(1));
                node = this.addWordRecursive(node, word.slice(1));
            } else {
                //while (node.right != null && node.right.value != word.charAt(0)) {
                while (node.right != null && node.right.value != word[0]) {
                    node = node.right;
                }
                if (node.right != null) {
                    //node.right = this.addWordRecursive(node.right, word.substring(1));
                    node.right = this.addWordRecursive(node.right, word.slice(1));
                    node.right.parent = node;
                    node.right.type = 1;
                } else {
                    //head.down = this.addRight(head.down, word.charAt(0));
                    head.down = this.addRight(head.down, word[0]);
                    head.down.parent = head;
                    head.down.type = 0;
                    head = this.addWordRecursive(head, word);
                }
            }
        }
        return head;
    }

    addWord(arrayWord) {
        this.head = this.addWordRecursive(this.head, arrayWord);
        this.tableData = [[]];
        this.lineCounter = 0;
        this.treeToMatrix(this.head);
        this.completeMatrix();
    }

    //CREATE HTML
    setChar(node, charCounter, dir) {
        let data = {};
        data.value = null;
        while (this.tableData[this.lineCounter].length - 1 < charCounter * 2) {
            this.tableData[this.lineCounter].push(data);
        }
        if (dir == 1) {
            let lineFrom = null;
            for (let i = 1; i < this.lineCounter; i++) {
                while (this.tableData[i].length - 1 < charCounter * 2) {
                    this.tableData[i].push({ data });
                }
                if (this.tableData[i][charCounter * 2].value != null) {
                    lineFrom = i;
                }
            }
            for (let i = lineFrom + 1; i < this.lineCounter; i++) {
                data = {};
                data.value = '--';
                this.tableData[i][charCounter * 2] = data;
            }
        } else if (dir == 0) {
            let data = {};
            data.value = '||';
            this.tableData[this.lineCounter][(charCounter * 2) - 1] = data;
        }
        data = {};
        data.value = (node.value == null ? '?' : node.value);

        this.tableData[this.lineCounter][charCounter * 2] = data;
    }

    addLine() {
        this.tableData.push([]);
        this.tableData.push([]);

        this.lineCounter++;
        this.lineCounter++;
    }

    treeToMatrix(head, charCounter = 0, dir = null) {
        if (head.value == null) {
            this.tableData.push([]);
        }
        //
        this.setChar(head, charCounter, dir);
        if (head.down != null) {
            this.treeToMatrix(head.down, charCounter + 1, 0);
        }
        if (head.right != null) {
            this.addLine();
            this.treeToMatrix(head.right, charCounter, 1);
        }

    }

    completeMatrix() {
        let counter = 0;

        for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].length > counter) {
                counter = this.tableData[i].length;
            }
        }
        for (let i = 0; i < this.tableData.length; i++) {
            while (this.tableData[i].length < counter) {
                let data = {};
                data.value = null;
                this.tableData[i].push(data);
            }
        }
    }

    getMatrixHTML() {
        let html = '';
        let data = {};
        for (let i = 0; i < this.tableData[0].length; i++) {
            html += '<tr>';
            for (let j = 0; j < this.tableData.length; j++) {

                if (this.tableData[j][i].value == '||') {
                    html += '<td class="verticalLine">&nbsp;</td>';
                } else if (this.tableData[j][i].value == '--') {
                    html += '<td class="horizontalLine">&nbsp;</td>';
                } else if (this.tableData[j][i].value == '}') {
                    html += '<td><div class="node node_key"><strong>' + this.tableData[j][i].value + '</strong></div></td>';
                } else if (this.tableData[j][i].value != null) {
                    html += '<td><div class="node"><strong>' + this.tableData[j][i].value + '</strong></div></td>';
                } else {
                    html += '<td class="empty">&nbsp;</td>';
                }
            }
            html += '</tr>';
        }



        return html;
    }



    //RESTART
    restart() {
        this.tableData = [[]];
        this.lineCounter = 0;
        this.wordsList = [];
        this.head = new Node(null);
        this.head.down = new Node('}');
        this.treeToMatrix(this.head);
        this.completeMatrix();
    }
}

class ListNode {
    data;
    next;

    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class Queue {

    head;

    constructor() {
        this.head = null;
    }

    enqueue(data) {
        var newNode = new ListNode(data);

        if (this.head == null) {
            this.head = newNode;
        } else {
            let nodeParent = this.findTail();
            nodeParent.next = newNode;
        }
    }

    findTail() {
        let pivot = this.head;
        while (pivot.next != null) {
            pivot = pivot.next;
        }
        return pivot;
    }

    dequeue() {

        var removed = this.head;
        var next = this.head.next;

        this.head = next;
        return removed.data;
    }

    isEmpty() {
        return this.head == null;
    }
}

const graph = new Graph();
let insertData = true;

function insertNode(x, y) {
    if (insertData == true) {
            graph.insertNode(x, y);
            drawTable();
            drawGraph();
    }
}

function insertEdges() {
    let error = false;
    for (let i = 1; i < graph.nodesList.length; i++) {
        for (let j = 1; j < graph.nodesList.length - 1; j++) {
            let val = Number.parseInt($('#edge_' + i + '_' + j).val());
            if (val == i || val < 0) {
                error = true;
            }
        }
    }
    if (error === false) {
        for (let i = 1; i < graph.nodesList.length; i++) {
            //graph.edgesList[graph.nodeCounter] = [];
            for (let j = 1; j < graph.nodesList.length - 1; j++) {
                if ($('#edge_' + i + '_' + j).val() > 0) {
                    let val = $('#edge_' + i + '_' + j).val();
                    graph.insertEdge(i, parseInt(val))
                }
            }
        }
        insertData = false;
        for (let i = 1; i < graph.nodesList.length; i++) {
            for (let j = 1; j < graph.nodesList.length - 1; j++) {
                $('#edge_' + i + '_' + j).attr("readonly", true);
                $("#setEdgesBtn").attr("disabled", true);
            }
        }
    } else {
        alert("No deben existir ciclos y todos los datos deben ser enteros mayores que 0");
    }
    drawGraph();
    drawTrees();
}

function drawGraph() {
    // create an array with nodes
    let nodesData = [];
    let nodesList = graph.nodesList;
    for (let i = 1; i < nodesList.length; i++) {
        let node = nodesList[i];
        nodesData.push({ id: node.id, label: node.id.toString(), x: node.x, y: node.y });
    }
    let nodes = new vis.DataSet(nodesData);

    // create an array with edges
    let edgesData = [];
    let edgesList = graph.edgesList;
    for (let i = 1; i < edgesList.length; i++) {
        if (Array.isArray(edgesList[i]) && edgesList[i].length > 0) {
            for (let j = 0; j < edgesList[i].length; j++) {
                edgesData.push({ from: i, to: edgesList[i][j] });
            }
        }
    }
    let edges = new vis.DataSet(edgesData);

    // create a network
    let container = document.getElementById('mynetwork');

    // provide the data in the vis format
    let data = {
        nodes: nodes,
        edges: edges
    };
    let options = {
        edges: {
            smooth: false
        },
        physics: false,
        interaction: {
            dragNodes: false,
            zoomView: false,
            dragView: false
        }
    };

    // initialize your network!
    let network = new vis.Network(container, data, options);
    network.on('click', function (e) { onClick(e) });

    /* DEFINE CALLBACKS HERE */
    function onClick(e) {
        insertNode(e.pointer.canvas.x, e.pointer.canvas.y);
    }
}

function drawTable() {
    let html = "";
    for (let i = 1; i < graph.nodesList.length; i++) {
        html += "<tr>";
        html += "<th>" + i + "</th>";
        for (let j = 1; j < graph.nodesList.length - 1; j++) {
            html += "<td>";
            html +=
                '<div class="form-group">' +
                '<select name="edge_' + i + '_' + j + '" id="edge_' + i + '_' + j + '" class="form-control">';
            html += '<option value=""></option>';
            for (let k = 1; k <= graph.nodeCounter; k++) {
                if (k != i) {
                    html += '<option value="' + k + '">' + k + '</option>';
                }
            }

            html += '</select>'
            '</div>';
            html += "</td>";
        }
        html += "</tr>";
    }
    $('#edgesTable').html(html)
}

function drawTrees() {

    let html = "";
    for (let i = 1; i < graph.nodesList.length; i++) {
        graph.addedList = [];
        graph.tree = new Tree();
        html += '<div class="col-md-4">';
        html += '<h6>Origen ' + i + '</h6>';
        html += '<div class="table-responsive">';
        html += '<table class="mb-5">';
        html += graph.widthTourFrom(i);
        html += '</table>';
        html += '</div>';
        html += '</div>';
    }
    $('#tableWidthTrees').html(html)

    html = "";
    for (let i = 1; i < graph.nodesList.length; i++) {
        graph.addedList = [];
        graph.tree = new Tree();
        html += '<div class="col-md-4">';
        html += '<h6>Origen ' + i + '</h6>';
        html += '<div class="table-responsive">';
        html += '<table class="mb-5">';
        html += graph.depthTourFrom(i);
        html += '</table>';
        html += '</div>';
        html += '</div>';
    }
    $('#tableDepthTrees').html(html);
}

drawGraph()




