import Message from './Message';
import messageManager from './messageManager';

const showMessage = messageManager.showMessage.bind(messageManager);

export {
    Message,
    showMessage,
};