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
        this.tempTree = [];
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

    widthTourFrom(id, word = "") {
        id = Number.parseInt(id);
        word += String(id);
        let recentlyAddedList = [];
        if (this.addedList.length == 0) {
            this.tempTree.addWord(word);
            this.addedList.push(id);
        }
        if (Array.isArray(this.edgesList[id])) {
            //this.tempList.push(id);
            for (let j = 0; j < this.edgesList[id].length; j++) {

                if (this.addedList.indexOf(this.edgesList[id][j]) == -1) {
                    this.tempTree.addWord(word + this.edgesList[id][j]);
                    this.addedList.push(this.edgesList[id][j]);
                    recentlyAddedList.push(this.edgesList[id][j]);
                }

            }
            for (let j = 0; j < this.edgesList[id].length; j++) {
                if (this.addedList.indexOf(this.edgesList[id][j]) == -1 || recentlyAddedList.indexOf(this.edgesList[id][j]) != -1) {
                    this.widthTourFrom(this.edgesList[id][j], word);
                }
            }
        }
        return this.tempTree.getMatrixHTML();
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

    //ADD TO TREE
    addRight(head, char) {
        if (head != null) {

            if (head.value == '}' || head.value.charCodeAt(0) > char.charCodeAt(0)) {
                let newNode = new TreeNode(char);
                head.parent = newNode;
                head.type = 1;
                newNode.right = head;
                return newNode;
            } else {
                let node = head;
                while (node.right != null && node.right.value.charCodeAt(0) < char.charCodeAt(0)) {
                    node = node.right;
                }
                let newNode = new TreeNode(char);
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
            return new TreeNode(char);
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
                head.down = this.addRight(null, word.charAt(0));
                head.down.parent = head;
                head.down.type = 0;
                head = this.addWordRecursive(head, word);
            } else if (node.value == word.charAt(0)) {//si la letra de abajo coincide
                node = this.addWordRecursive(node, word.substring(1));
            } else {
                while (node.right != null && node.right.value != word.charAt(0)) {
                    node = node.right;
                }
                if (node.right != null) {
                    node.right = this.addWordRecursive(node.right, word.substring(1));
                    node.right.parent = node;
                    node.right.type = 1;
                } else {
                    head.down = this.addRight(head.down, word.charAt(0));
                    head.down.parent = head;
                    head.down.type = 0;
                    head = this.addWordRecursive(head, word);
                }
            }
        }
        return head;
    }

    addWord(word) {
        if (!this.wordsList.includes(word)) {
            this.head = this.addWordRecursive(this.head, word);
            this.tableData = [[]];
            this.lineCounter = 0;
            this.treeToMatrix(this.head);
            this.completeMatrix();
            this.wordsList.push(word);
            this.wordsList.sort();
        } else {
            alert("la palabra ya se encuentra en el árbol.");
        }
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

    getListHTML() {
        let html = '<ul>';
        for (let i = 0; i < this.wordsList.length; i++) {
            html += '<li>' + this.wordsList[i] + '</li>';
        }
        html += '</ul>';
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

const graph = new Graph();
let insertData = true;

function insertNode(x, y) {
    if (graph.nodeCounter < 9 && insertData == true) {
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
                '<input type="number" name="edge_' + i + '_' + j + '" id="edge_' + i + '_' + j + '" class="form-control" value="" autocomplete="off" min="0" step="1">' +
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
        graph.tempTree = new Tree();
        html += '<div class="col-md-4">';
        html += '<h6>Origen ' + i + '</h6>';
        html += '<div class="table-responsive">';
        html += '<table class="mb-5">';
        html += graph.widthTourFrom(i);
        html += '</table>';
        html += '</div>';
        html += '</div>';
    }
    //html = graph.pathsFrom(1);
    $('#tableTrees').html(html)
}

drawGraph()




