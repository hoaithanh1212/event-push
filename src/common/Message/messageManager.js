export default {
    message: null,
    registerMessage(component) {
        this.message = component;
    },
    unregisterMessage() {
        this.message = null;
    },
    showMessage(message) {
        this.message.pushMessage(message);
    },
};