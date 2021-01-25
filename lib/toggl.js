const axios = require('axios')

class Toggl {
    constructor(API_TOKEN) {
        this.baseUrl = 'https://api.track.toggl.com/api/v8'
        this.auth = {
            username: API_TOKEN,
            password: 'api_token'
        };
    }
    async start(name, projectId) {
        const timeEntryData = {
            description: name,
            start: new Date(),
            duration: -1,
            created_with: 'node-toggl'
        }
        if (projectId) {
            timeEntryData.pid = projectId
        }
        const res = await axios.post(`${this.baseUrl}/time_entries/start`, {
            time_entry: timeEntryData
        }, {
            auth: this.auth,
        })
        return res.data.data;

    }
    async stop() {
        const entry = await this.getEntry();
        const id = entry.id;
        const res = await axios.put(`${this.baseUrl}/time_entries/${id}/stop`, {}, {
            auth: this.auth
        });
        return res.data.data;
    }
    async getTags() {
        const userData = await axios.get(`${this.baseUrl}/me`, {
            auth: this.auth
        })
        const workspaceId = userData.data.data.workspaces[0].id
        const res = await axios.get(`${this.baseUrl}/workspaces/${workspaceId}/tags`, {
            auth: this.auth
        })
        if (!res.data) {
            throw new Error('No tags')
        }
        return res.data;
    }
    async getEntry() {
        const res = await axios.get(`${this.baseUrl}/time_entries/current`, {
            auth: this.auth
        })
        if (!res.data) {
            throw new Error('No entry in progress')
        }
        return res.data.data;
    };
    async getProjects() {
        const res = await axios.get(`${this.baseUrl}/me?with_related_data=true`, {
            auth: this.auth
        })
        if (!res.data.data) {
            throw new Error('No entry in progress')
        }
        // Store UserData for cached use
        this.userData = res.data.data;

        return res.data.data.projects.filter((project) => {
            return project.server_deleted_at === undefined
        });
    }
    async createProject(name) {
        const res = await axios.post(`${this.baseUrl}/projects`, {
            project: {
                name,
                is_private: true,
                wid: this.userData.workspaces[0].id
            }
        }, {
            auth: this.auth
        })

        return res.data.data;
    }

}
/*
 * export module
 */
module.exports = Toggl;
