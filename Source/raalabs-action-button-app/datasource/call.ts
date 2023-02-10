
export type CallRequestBody = {
    endpoint: string;
    method: string;
    path?: string;
};

export type CallResponseBody = {
    statusCode: number;
};
