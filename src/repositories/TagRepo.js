import { fetchIt } from "./Fetch"

export const TagRepo = {
    async getAll() {
        return await fetchIt(`http://localhost:8088/tags`)
    },
}