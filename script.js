// Load data from server

let nodes = new vis.DataSet([
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
]);

let edges = new vis.DataSet([
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
]);

let defaultFocusNodeId = 1;

const container = document.getElementById("network");
const url = "https://7ru4yz3cg0.execute-api.us-east-1.amazonaws.com/dev/project/list";

let data = {
    nodes: nodes,
    edges: edges,
};

let options = {
    nodes: {
        shape: "box",
        margin: 10,
        color: {
            border: "#FFF",
            background: "#724DDA",
        },
        font: {
            color: "#FFF",
        },
        shadow: {
            color: "#FFF",
        },
    },
    edges: {
        smooth: {
            enabled: false,
        },
    },
    physics: {
        barnesHut: {
            gravitationalConstant: -30000,
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
    focusOnNode(defaultFocusNodeId);
    network.removeEventListener("stabilized", stableListner);
}

// Setup initial focus
network.on("stabilized", stableListner);


//Interaction

const changeNodeFocus = e => focusOnNode(e.currentTarget.value);

const focusOnNode = (nodeId = 1, scale = 1.6) => {
    let options = {
        scale: scale,
        animation: {
            duration: 1200,
            easingFunction: 'easeInOutQuad',
        },
    };
    network.focus(nodeId, options);
}

const fitAminate = () => network.fit({
    animation: {
        duration: 1200,
        easingFunction: 'easeInOutQuad',
    },
});

fetch(url)
    .then(res => res.json())
    .then(data => {
        console.log(JSON.parse(data));
        if (data.status === 200) {
            console.log(JSON.parse(data.body));
        }
    });