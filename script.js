// Load data from server

/* let nodes = new vis.DataSet([
    { id: 1, label: "Javascript", },
    { id: 2, label: "Project 1", },
    { id: 3, label: "Project 2", },
    { id: 4, label: "Project 3", },
    { id: 5, label: "Project 4", },
    { id: 6, label: "Project 6", },
    { id: 7, label: " A long User Name ...", },
    { id: 8, label: "Drupal" },
    { id: 9, label: "Project 7", },
    { id: 10, label: "Project 8", },
    { id: 11, label: "Project 9", },
    { id: 12, label: "Project 10", },
    { id: 13, label: "Project 11", },
    { id: 14, label: "Project 12", },
    { id: 15, label: "Project 13", },
    { id: 16, label: "User 1", },
]); */

/* let edges = new vis.DataSet([
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 1, to: 4 },
    { from: 1, to: 5 },
    { from: 7, to: 6 },
    { from: 7, to: 5 },
    { from: 8, to: 9 },
    { from: 8, to: 10 },
    { from: 8, to: 11 },
    { from: 8, to: 15 },
    { from: 16, to: 12 },
    { from: 16, to: 13 },
    { from: 16, to: 14 },
    { from: 1, to: 12 },
]); */

let nodes = new vis.DataSet();
let edges = new vis.DataSet();

let defaultFocusNodeId = 1;

const container = document.getElementById("network");
const projectListEle = document.getElementById("nodes");
const url = "https://7ru4yz3cg0.execute-api.us-east-1.amazonaws.com/dev/project/list";
const url2 = "https://7ru4yz3cg0.execute-api.us-east-1.amazonaws.com/dev/project/list-test";

let data = {
    nodes: nodes,
    edges: edges,
};

let options = {
    nodes: {
        shape: "circle",
        margin: 10,
        color: {
            border: "#FFF",
            background: "#724DDA",
        },
        shadow: {
            color: "#FFF",
        },
        size: 10,
    },
    edges: {
        smooth: {
            enabled: false,
        },
        color: {
            color: "#FFF",
            inherit: false,
        },
    },
    physics: {
        barnesHut: {
            gravitationalConstant: -5000,
            springLength: 120,
            avoidOverlap: 1,
        }
    },
    layout: {
        randomSeed: 718896,
    },
};

// Create a network and render it 
let network = new vis.Network(container, data, options);

const stableListner = (e) => {
    let node = getRamdonNode();
    let pos = network.getPositions(node.id);
    setTimeout(() => network.moveNode(node.id, pos[node.id].x + 20, pos[node.id].y + 20), 50);
}

// Setup initial focus
//network.on("stabilized", stableListner);


//Interaction

const changeNodeFocus = e => focusOnNode(e.currentTarget.value);

const focusOnNode = (nodeId = 1, scale = 1) => {
    let options = {
        scale: scale,
        animation: {
            duration: 1200,
            easingFunction: 'easeInOutQuad',
        },
    };

    !!nodeId ? network.focus(nodeId, options) : fitAminate();
}

const fitAminate = () => network.fit({
    animation: {
        duration: 1200,
        easingFunction: 'easeInOutQuad',
    },
});

fetch(url2)
    .then(res => {
        return res.json();
    })
    .then(data => {
        let counter = 0;
        data.nodes.forEach(node => {
            node.id = counter;
            counter++;
            Object.assign(node, data.category[node.category]);
            if (node.nodeWeight > 1) {
                node.font.size = (node.nodeWeight * 14) / 2;
                node.font.bold = true;
            }
            nodes.add(node);
            node.projects.forEach(project => {
                project.id = counter;
                project.label = project.label.split(" ").join("\n");
                counter++;
                Object.assign(project, data.category[project.category]);
                nodes.add(project);
                edges.add({ to: node.id, from: project.id });
            });
        });
        loadFocusOptions(data);
    });

const loadFocusOptions = (data) => {
    let optionGrps = {};

    data.nodes.forEach(node => {
        let option = document.createElement('option');
        option.innerHTML = node.label;
        option.value = node.id;
        if (optionGrps[node.category]) {
            optionGrps[node.category].appendChild(option);
        } else {
            let optGrp = document.createElement('optgroup');
            optGrp.label = node.category.charAt(0).toUpperCase() + node.category.slice(1);
            optionGrps[node.category] = optGrp;
        }
    });

    for (let grp in optionGrps) {
        projectListEle.appendChild(optionGrps[grp]);
    }
}

const getRamdonNode = () => {
    let nodeIds = nodes.getIds();
    return nodes.get(nodeIds[Math.floor(Math.random() * nodeIds.length)]);
}