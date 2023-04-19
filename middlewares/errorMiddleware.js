const errorMiddleware = (err, req, res, next) => {
    console.log(err);

    // default error
    const defaultErrors = {
        statusCode: 500,
        message: err
    }

    res.status(500).send({
        success: false,
        message: "Something went wrong",
        err,
    });

    // missing field error
    if (err.name === 'ValidationError') {
        defaultErrors.statusCode = 400,
        defaultErrors.message = Object.values(err.errors).map(item => item.message).join(',')
    }
    res.status(defaultErrors.statusCode).json({ message: defaultErrors.message });

    // // deuplicate error
    if (err.code && err.code === 11000) {
        defaultErrors.statusCode = 400,
            defaultErrors.message = `${Object.keys(err.keyValue)} field has to be unique`
    }
};

export default errorMiddleware;