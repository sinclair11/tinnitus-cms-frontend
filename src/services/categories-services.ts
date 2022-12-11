import axios from 'axios';

export async function insertCategory(auth: string, form: any): Promise<string> {
    try {
        const response = await axios({
            method: 'POST',
            url: 'http://localhost:8080/api/admin/categories',
            data: form,
            headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${auth}` },
        });
        return response.data;
    } catch (error: any) {
        alert(error);
    }

    return 'Could not add category';
}

export async function getCategories(auth: string, which: string): Promise<any> {
    try {
        const response = await axios.get(`http://127.0.0.1:8080/api/admin/categories?which=${which}`, {
            headers: { Authorization: `Bearer ${auth}` },
        });

        return response.data;
    } catch (error: any) {
        alert(error);
    }
}

export async function getCategory(auth: string, id: string): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:8080/api/admin/categories/category?id=${id}`, {
            headers: { Authorization: `Bearer ${auth}` },
        });

        return response.data;
    } catch (error: any) {
        alert(error);
    }
}

export async function deleteCategory(auth: string, id: string): Promise<string> {
    try {
        const response = await axios.delete(`http://localhost:8080/api/admin/categories/category?id=${id}`, {
            headers: { Authorization: `Bearer ${auth}` },
        });

        return response.data;
    } catch (error: any) {
        alert(error);
    }

    return 'Could not delete requested item';
}

export async function updateCategory(auth: string, category: any): Promise<string> {
    try {
        const response = await axios({
            method: 'PUT',
            url: 'http://localhost:8080/api/admin/categories',
            headers: { Authorization: `Bearer ${auth}` },
            data: category,
        });

        return response.data;
    } catch (error: any) {
        alert(error);
    }

    return 'Could not update requested item';
}
