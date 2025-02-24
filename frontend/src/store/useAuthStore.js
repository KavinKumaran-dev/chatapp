import {create} from "zustand";
import {axiosInstance} from "../lib/axios.js";
import toast from "react-hot-toast";
import axios from "axios";
import {io} from "socket.io-client";
const BASE_URL="http://localhost:2000";
export const useAuthStore = create((set,get) => ({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers:[],
    socket:null,
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser:res.data});
            get().connectSocket();
        } catch (error) {
            console.log("Error in checkAuth",error);
            set({authUser:null});
        }
        finally{
            set({isCheckingAuth:false});
        }
    },
    signup: async (data) => {
        set({isSigningUp:true});
        try {
            const res = await axiosInstance.post("/auth/signup",data);
            set({authUser:res.data});
            toast.success("Account created successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally{
            set({isSigningUp:false});
        }
    },
    logout:async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logged Out Successfully");
            get().disConnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    login: async (data) => {
        try {
            set({isLoggingIn:true});
            const response = await axiosInstance.post("/auth/login",data);
            set({authUser:response.data});
            toast.success("Logged In Successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally{
            set({isLoggingIn:false});
        }
    },
    updateProfile: async (data) => {
        try {
            set({isUpdatingProfile:true});
            const res = await axiosInstance.put("/auth/update-profile",data);
            set({authUser:res.data});
            toast.success("Profile Photo Updated");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isUpdatingProfile:false});
        }
    },
    connectSocket : () => {
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL,{
            query:{
                userId:authUser._id,
            }
        });
        socket.connect();
        set({socket:socket});
        socket.on("getOnlineUsers",(userIds) => {
            set({onlineUsers:userIds});
        });
    },
    disConnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect();
    }
}));