async function fetchApi(path, methodType, bodyParams) {
    try {
        const response = await fetch(path, {
            method: methodType,
            headers: {
                "Content-Type": "application/json",
            },
            ...(bodyParams && { body: JSON.stringify(bodyParams) }),
        });
        const data = await response.json();

        return data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export default fetchApi;
