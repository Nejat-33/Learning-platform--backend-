import Resource from '../models/resource.model.js';
import AppError from '../utils/customerror.handler.js';


export const fetchAllResources = async (query) => {

    const filter = query.category ? { category: query.category } : {};
    return await Resource.find(filter).sort({ createdAt: -1 });
};


export const createResourceRecord = async (data, file) => {
    let imageUrl = data.url;

    if (file) {
        const uploadResult = await cloudinary.uploader.upload(file.path, {
            folder: 'novacore_gallery',
        });
        imageUrl = uploadResult.secure_url;
    }

    if (!imageUrl) throw new AppError('Image URL or File is required', 400);

    const newResource = await Resource.create({
        ...data,
        url: imageUrl
    });

    return newResource;
};

export const deleteResourceRecord = async (id) => {
    const resource = await Resource.findByIdAndDelete(id);
    if (!resource) throw new AppError('Resource not found', 404);
    
    return resource;
};