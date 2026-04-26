import {  deleteResourceRecord, fetchAllResources } from "../services/resource.service.js";
import Resource from "../models/resource.model.js";


export const getResources = async (req, res, next) => {
    try {
        const resources = await fetchAllResources(req.query);
        res.status(200).json({
            success: true,
            count: resources.length,
            data: resources
        });
    } catch (error) {
        next(error);
    }
};

export const addResource = async (req, res, next) => {
    try {
        const { title, category } = req.body;
        
       
        if (!req.file) {
            return res.status(400).json({ message: "Please upload an image" });
        }

        const imageUrl = `/uploads/${req.file.filename}`;

        const newResource = await Resource.create({
            title,
            category,
            url: imageUrl
        });

        res.status(201).json({
            success: true,
            data: newResource
        });
    } catch (error) {
        next(error);
    }
};

export const removeResource = async (req, res, next) => {
    try {
        await deleteResourceRecord(req.params.id);
        res.status(200).json({
            success: true,
            message: "Resource deleted"
        });
    } catch (error) {
        next(error);
    }
};