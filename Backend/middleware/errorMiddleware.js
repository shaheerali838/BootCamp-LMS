export const notFound = (req, res, next) => {
    res.status(404).json({ error: "Not Found" });
};

export const errorHandler = (err, req, res, next) => {
    if (process.env.NODE_ENV !== "production") {
        console.error(err);
    }

    const statusCode = err.statusCode || err.status || 500;

    res.status(statusCode).json({
        error: statusCode === 500 ? "Internal Server Error" : err.message || "An error occurred",
        ...(process.env.NODE_ENV === "development" && {
            stack: err.stack,
        }),
    });
};