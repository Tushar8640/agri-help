"use server"

import { prisma } from "@/lib/prisma"


export const getProjects = async () => {
    try {
        const response = await prisma.project.findMany({
            where: { userId: 1 },
            include: {
                costs: true,
                harvests: true,
                crops: true,
            },
            orderBy: { createdAt: 'desc' },
        })

        console.log("error response", response)
        if (response) {
            return response
        } else {
            console.log('failed to create project', response)
        }
    } catch (error) {
        console.log(error)
    }
}

export const createProject = async (data: any) => {
    try {
        const response = await prisma.project.create({
            data
        })

        console.log("error response", response)
        if (response) {
            return response
        } else {
            console.log('failed to create project', response)
        }
    } catch (error) {
        console.log(error)
    }
}
export const createCost = async (data: any) => {
    try {
        const response = await prisma.cost.create({
            data
        })

        console.log("error response from cost", response)
        if (response) {
            return response
        } else {
            console.log('failed to create cost', response)
        }
    } catch (error) {
        console.log(error)
    }
}
export const createHarvest = async (data: any) => {
    try {
        const response = await prisma.harvest.create({
            data
        })

        console.log("error response from harvest", response)
        if (response) {
            return response
        } else {
            console.log('failed to create harvest', response)
        }
    } catch (error) {
        console.log(error)
    }
}
export const createCrop = async (data: any) => {
    try {
        const response = await prisma.crop.create({
            data
        })

        console.log("error response from crop", response)
        if (response) {
            return response
        } else {
            console.log('failed to create crop', response)
        }
    } catch (error) {
        console.log(error)
    }
}