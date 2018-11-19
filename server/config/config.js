//Determine database environment (test or dev)
// and provide to our dependencies
var env = process.env.NODE_ENV || 'development';

//switched from 'localhost' to IP-based URI to avoid timeouts during testing 
if(env === 'development'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/TodoApp';
}else{
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/TodoAppTest';
}

