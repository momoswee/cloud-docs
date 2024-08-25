import TextEditor from './TextEditor';
import Header from './components/Header';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';

function App() {
  return (
    
    <Router>
      <Header/>
      <Switch>
        <Route path="/documents/:id">
          <TextEditor />
        </Route>
        <Route path="*">
          <Redirect to={`/documents/${uuidV4()}`} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
