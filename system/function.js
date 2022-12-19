/**
   * Credits by Hyzer Official
   * Thanks to Dika Ardnt and Willdan Azzudin and Fadly ID
*/

import axios from 'axios'

async function getBuffer(url, options){
	try {
		options ? options : {}
		const res = await axios({
			method: "get",
			url,
			headers: {
				'DNT': 1,
				'Upgrade-Insecure-Request': 1
			},
			...options,
			responseType: 'arraybuffer'
		})
		return res.data
	} catch (err) {
		return err
	}
}

function jsonformat(string) {
    return JSON.stringify(string, null, 2)
}

export {
 getBuffer,
 jsonformat
}