import idiom from "idiom.js";

const lang = idiom({
    default: {
        welcome: "Welcome!"
    },
    ES: {
        welcome: "Bienvenido!"
    }
});

export default lang(window.navigator.language);
