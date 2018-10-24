import Phaser from "phaser";
import GameScene from "./scenes/GameScene";
import io from "socket.io-client";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "content",
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    scene: [GameScene]
};

class Client extends Phaser.Game {
    constructor() {
        super(config);
        const socket = io("http://localhost:8080");
        socket.on("connect", function() {
            console.log("connected");
        });
    }
}

export default Client;
