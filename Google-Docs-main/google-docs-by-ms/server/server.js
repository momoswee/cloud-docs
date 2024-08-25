const mongoose = require('mongoose');
const Document = require('./Document');
const dotenv = require("dotenv");

dotenv.config();
const DEFAULT_VALUE = '';

const PORT =process.env.PORT || 5000;

const URL = process.env.MONGODB_URI 

const connectToDb = async () => {
  try {
    mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    })
  } catch (e) {
    console.error('Could not connect to database', e);
  }
}

const io = require('socket.io')(3001, {
  cors: {
    origin: {PORT},
    methods: ['GET', 'POST']
  }
});

io.on('connection', socket => {
  socket.on('get-document', async documentId => {
    let document = null;
    try {
      document = await findOrCreateDocument(documentId);
    } catch (e) {
      console.error('error in creating or finding doccument', e);
    }
    socket.join(documentId);
    socket.emit('load-document', document.data);
    socket.on('send-delta', delta => {
      socket.broadcast.to(documentId).emit('received-delta', delta);
    });
    socket.on('save-document', async data => {
      try {
        await Document.findByIdAndUpdate(documentId, { data });
      } catch (e) {
        console.error('Problem while saving document', e);
      }
    })
    console.log('Client connected');
  })
});

const findOrCreateDocument = async id => {
  if (id == null) return;
  const document = await Document.findById(id);
  if (document) return document;
  return await Document.create({ _id: id, data: DEFAULT_VALUE });
};

connectToDb();