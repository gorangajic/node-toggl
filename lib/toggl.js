const debug = require('debug')('toggl-api')
const axios = require('axios')

class Toggl {
    constructor(API_TOKEN) {
        this.baseUrl = 'https://api.track.toggl.com/api/v8'
        this.auth = {
            username: API_TOKEN,
            password: 'api_token'
        };
    }
    async start(name, options) {
        const timeEntryData = {
            description: name,
            start: new Date(),
            duration: -1,
            created_with: 'node-toggl',
            ...options

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
    async getTags(tagList) {
        const tagSet = new Set(tagList);
        const userData = await axios.get(`${this.baseUrl}/me`, {
            auth: this.auth
        })
        const workspaceId = userData.data.data.workspaces[0].id
        const res = await axios.get(`${this.baseUrl}/workspaces/${workspaceId}/tags`, {
            auth: this.auth
        })
        const allTags = res.data;
        if (tagSet.size === 0) {
            if (!allTags) {
                throw new Error('No tags')
            }
            return allTags;
        }

        // Create provided list of tags
        const output = [];
        for (let tag of tagSet) {
            const exists = allTags.find((existingTag) => {
                return tag === existingTag.name
            })
            if (exists) {
                output.push(exists)
            } else {
                debug(`Creating new tag ${tag}`);
                const newTag = await this.createTag(tag, workspaceId);
                if (newTag) {
                    output.push(newTag);
                }

            }
        }
        return output;
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
    async createTag(name, workspaceId) {
        try {
            const res = await axios.post(`${this.baseUrl}/tags`, {
                tag: {
                    name,
                    wid: workspaceId
                }
            }, {
                auth: this.auth
            })

            return res.data.data;
        } catch (err) {
            return false
        }

    }
}
/*
 * export module
 */
module.exports = Toggl;
