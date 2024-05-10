import { useSocket } from "@/providers/socket-provider";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { TMessageWithSender } from "../types";

type TUseChatSocketProps = {
    addKey: string;
    updateKey: string;
    queryKey: string;
};

export const useChatSocket = ({ addKey, updateKey, queryKey }: TUseChatSocketProps) => {
    const { socket } = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {

        if (!socket) return;

        socket.on(updateKey, (message: TMessageWithSender) => {
            queryClient.setQueryData([queryKey], (oldData: any) => {
                if (!oldData || !oldData.pages || oldData.pages.length === 0) return oldData;

                const newData = oldData.pages.map((page: any) => {
                    return {
                        ...page,
                        messages: page.messages.map((m: TMessageWithSender) => {
                            if (m.id === message.id) return message;

                            return m;
                        })
                    }
                });

                return {
                    ...oldData,
                    pages: newData
                };
            });
        });

        socket.on(addKey, (message: TMessageWithSender) => {
            queryClient.setQueryData([queryKey], (oldData: any) => {
                if (!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return {
                        pages: [{
                            messages: [message]
                        }]
                    }
                }

                const newData = [...oldData.pages];

                newData[0] = {
                    ...newData[0],
                    messages: [message, ...newData[0].messages]
                }

                return {
                    ...oldData,
                    pages: newData
                };
            });
        });

        return () => {
            socket.off(addKey);
            socket.off(updateKey);
        };
    }, [socket, queryClient, addKey, updateKey, queryKey]);

}