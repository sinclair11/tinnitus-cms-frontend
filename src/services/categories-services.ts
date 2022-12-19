import axios from 'axios';

export async function insertCategory(form: any): Promise<string> {
    try {
        const response = await axios({
            method: 'POST',
            url: 'http://localhost:8080/api/admin/categories',
            data: form,
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error: any) {
        throw error;
    }
}

export async function getCategories(which: string): Promise<any> {
    try {
        const response = await axios.get(`http://127.0.0.1:8080/api/admin/categories?which=${which}`, {});

        return response.data;
    } catch (error: any) {
        alert(error);
    }
}

export async function getCategory(id: string): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:8080/api/admin/categories/category?id=${id}`, {});

        return response.data;
    } catch (error: any) {
        alert(error);
    }
}

export async function deleteCategory(id: string): Promise<string> {
    try {
        const response = await axios.delete(`http://localhost:8080/api/admin/categories/category?id=${id}`, {});

        return response.data;
    } catch (error: any) {
        alert(error);
    }

    return 'Could not delete requested item';
}

export async function updateCategory(category: any): Promise<string> {
    try {
        const response = await axios({
            method: 'PUT',
            url: 'http://localhost:8080/api/admin/categories',
            data: category,
        });

        return response.data;
    } catch (error: any) {
        alert(error);
    }

    return 'Could not update requested item';
}
