try {
    console.log('Requiring utils/response...');
    require('./utils/response');
    console.log('Success utils/response');

    console.log('Requiring utils/socket...');
    require('./utils/socket');
    console.log('Success utils/socket');

    console.log('Requiring models/Notification...');
    require('./models/Notification');
    console.log('Success models/Notification');

    console.log('Requiring test.controller...');
    require('./controllers/test.controller');
    console.log('Success test.controller');
} catch (error) {
    console.error('Failed to require:', error);
}
