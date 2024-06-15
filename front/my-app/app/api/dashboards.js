import axios from 'axios';

const PROJECTS_URL = 'http://localhost:3001/projects';

const projectsApi = {
    async getAll() {
        const result = await axios.get(PROJECTS_URL); 
        console.log(result);
        return result.data;
    }
}

projectsApi.getAll();
