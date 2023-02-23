const fcl = require("@onflow/fcl");

fcl.config()
    .put('accessNode.api', process.env.ACCESS_NODE)