
import './App.css';

import {Button, Modal, makeStyles, TextField, Card, CardActions, CardContent} from '@material-ui/core/';
import AddIcon from '@material-ui/icons/Add';

import {useState, useEffect} from 'react';

import {db} from './firebase';
import axios from 'axios';

export default function App() {
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddProgrammer, setShowAddProgrammer] = useState(false);
  const [currProject, setCurrProject] = useState(null);
  const [currProjectHeadEmail, setCurrProjectHeadEmail] = useState(null);
  const [currProjectName, setCurrProjectName] = useState(null);
  const [programmerProperties, setProgrammerProperties] = useState({
    programmerName: '',
    programmerContact: '',
    programmerPersonality: '',
    programmerSkills: '',
    programmerLanguages: '',
    programmerWishes: ''
  });

  const [projectProperties, setProjectProperties] = useState(
    {
      projectName: '',
      projectDescription: '',
      projectHeadEmail: '',
      projectHeadContact: '',
      projectHeadName: '',
      projectChat: '',
      projectSpecialists: '',
      projectLanguages: ''
    }
  );

  const [projectsList, setProjectsList] = useState([]);

  useEffect(() => {
    getProjects();
  },[]);

  const sendMail = async() => {
    let params = {
      currProjectHeadEmail,
      currProjectName,
      programmerProperties
    };
    axios.post('http://localhost:4242/sendmail',  params )
  }

  const addProgrammerForm = async e => {
   e.preventDefault();
   await db.collection('programmers').add(programmerProperties);
   


   const projectRef = await db.collection('projects').doc(currProject).get();
   const data = await projectRef.data();
   data.ProjectParticipants.push(programmerProperties);
   await db.collection('projects').doc(currProject).set(data);
   
   getProjects();
   sendMail();
   setShowAddProgrammer(false);
   
   
    }

  const handleChange = e => {
    
    setProjectProperties(prevState => (
      { ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const handleChangeProgrammer = e => {
    setProgrammerProperties(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }
    ))
  }
  const getProjects = async()=> {
    const projectsRef = await db.collection('projects').get();
    let projectsRefList = [];
    projectsRef.forEach(doc => projectsRefList.push([doc.data(), doc.id]));
    setProjectsList(projectsRefList);
  }

  const formSubmit = async e => {
    e.preventDefault();
    await db.collection('projects').add(projectProperties);
    getProjects();
    setShowAddProject(false);
  }

  const currSave = (id, email, projectName) => {
    setCurrProject(id);
    setCurrProjectHeadEmail(email);
    setCurrProjectName(projectName);
    setShowAddProgrammer(true);
  }

  return (
    <div className="app">
      
      <div className="app__addproject">
          <Button 
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setShowAddProject(true)}
            >
              Добавить новый проект
            </Button>
      </div>
            <Modal
        className='app__addproject__modal'
        open={showAddProject}
      >
        <form className="app__addproject__modal__form" noValidate autoComplete="off" onSubmit={ (e) => formSubmit(e) }> 
        <div className='app__addproject__modal__form__inner'>
        <Button 
            color="primary"
            onClick={() => setShowAddProject(false)}
          >
            Закрыть
          </Button>
         
          <TextField label="Название проекта" name='projectName' className='app__addproject__modal__form__inner__field' onChange={(e) => handleChange(e)} />
          <TextField label="Описание проекта" name='projectDescription' className='app__addproject__modal__form__inner__field' onChange={(e) => handleChange(e)}/>
          <TextField label="Имя руководителя проекта" name='projectHeadName'  className='app__addproject__modal__form__inner__field' onChange={(e) => handleChange(e)}/>
          <TextField label="E-mail руководителя проекта" name='projectHeadEmail' className='app__addproject__modal__form__inner__field' onChange={(e) => handleChange(e)}/>
          <TextField label="Контакт руководителя проекта" name='projectHeadContact'  className='app__addproject__modal__form__inner__field' onChange={(e) => handleChange(e)}/>
          <TextField label="Чат проекта" name='projectChat'  className='app__addproject__modal__form__inner__field' onChange={(e) => handleChange(e)}/>
          <TextField label="Требуемые специалисты в проект" name='projectSpecialists' className='app__addproject__modal__form__inner__field' onChange={(e) => handleChange(e)}/>
          <TextField label="Языки, используемые в проекте" name='projectLanguages' className='app__addproject__modal__form__inner__field' onChange={(e) => handleChange(e)}/>
          <Button 
            color="primary"
            type="submit"
          >
            Сохранить и закрыть
          </Button>
        </div>
    </form>
      </Modal>


      <div className="app__projectslist">
        {
          projectsList.map(e => {
            
            return (
              <Card>
                <CardContent>
                  <h1>{e[0].projectName}</h1>
                  <p>{e[0].projectDescription}</p>
                  <p>Языки, используемые в проекте: {e[0].projectLanguages}</p>
                  <p>В проекте требуются следующие специалисты: {e[0].projectSpecialists}</p>
                  <p>Руководитель проекта: {e[0].projectHeadName}</p>
                  <p>Контакт руководителя проекта: {e[0].projectHeadContact}</p>
                  <p>Чат проекта: {e[0].projectChat}</p>
                  <p>Участники: {e[0].ProjectParticipants.map(e => `Имя: ${e.programmerName} Контакт: ${e.programmerContact}`).join(', ')}</p>
                  <Button
                   color="primary"
                   onClick={() => currSave( e[1], e[0].projectHeadEmail, e[0].projectName)}>
                    Хочу принять участие в проекте 
                  </Button>
                </CardContent>
              </Card>
            )
          })
        }

        <Modal 
          className="app__projectslist__modal"
          open={showAddProgrammer}
          >
            <form className="app__projectslist__modal__form" noValidate onSubmit={ (e) => addProgrammerForm(e) }> 
        <div className='app__projectslist__modal__form__inner'>
        <Button 
            color="primary"
            onClick={() => setShowAddProgrammer(false)}
          >
            Закрыть
          </Button>
         
          <TextField label="Имя программиста" name='programmerName' className='app__projectslist__modal__form__inner__field' onChange={(e) => handleChangeProgrammer(e)} />
          <TextField label="Как можно связаться" name='programmerContact' className='app__projectslist__modal__form__inner__field' onChange={(e) => handleChangeProgrammer(e)}/>
          <TextField label="О себе" name='programmerPersonality'  className='app__projectslist__modal__form__inner__field' onChange={(e) => handleChangeProgrammer(e)}/>
          <TextField label="Скиллы" name='programmerSkills' className='app__projectslist__modal__form__inner__field' onChange={(e) => handleChangeProgrammer(e)}/>
          <TextField label="Языки программирование" name='programmerLanguages'  className='app__projectslist__modal__form__inner__field' onChange={(e) => handleChangeProgrammer(e)}/>
          <TextField label="С чем хотелось бы работать?" name='programmerWishes'  className='app__projectslist__modal__form__inner__field' onChange={(e) => handleChangeProgrammer(e)}/>
          <Button 
            color="primary"
            type="submit"
          >
            Сохранить и закрыть
          </Button>
        </div>
    </form>

          </Modal>

      </div>


    </div>

   
  );
}

 