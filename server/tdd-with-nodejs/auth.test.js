const request = require('supertest');
const { app } = require('../app.js'); // Ensure this points to your Express app


const sum = require("./sum"); //sum is just for testing purposes

const {sC, connectTV, connectMovie} = require('../app.js');
const splitCinema = sC;
const TMDBConnectionTV = connectTV;
const TMDBConnectionMovie = connectMovie;


test('splitCinema, space translates to %20', () =>{
    expect(splitCinema(" ")).toBe("%20");
});

test('break bad id', async () => {
    expect((await TMDBConnectionTV("breaking bad"))[0].id).toBe(1396);
});

test('salt id movie id should be 27576', async () => {
    expect((await TMDBConnectionMovie("salt"))[0].id).toBe(27576);
});

describe("Authentication API", () => {
    test("should sign up a new user", async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({ email: "testuser@example.com", password: "password123" });
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toContain("User created successfully! 🥳");
    });

    test("should reject duplicate user registration", async () => {
        // First call to register the user
        await request(app)
            .post('/auth/signup')
            .send({ email: "testuser_jest@example.com", password: "password123" });
        
        // Second call should fail
        const response = await request(app)
            .post('/auth/signup')
            .send({ email: "testuser_jest@example.com", password: "password123" });
        expect(response.statusCode).toBe(500);
        expect(response.body.message).toContain("User already exists! Try logging in. 😄");
    });

    test("should login an existing user", async () => {
        const signup = await request(app)
        .post('/auth/signup')
        .send({ email: "testlogin_jest@example.com", password: "password123" });
        expect(signup.statusCode).toBe(200);  // Ensure the user is created successfully

        const response = await request(app)
            .post('/auth/signin')
            .send({ email: "testlogin_jest@example.com", password: "password123" });
        expect(response.statusCode).toBe(200);
        expect(response.body.type).toEqual('success');
    });

    test("should logout a user", async () => {
        const response = await request(app)
            .post('/auth/logout');
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toContain('Logged out successfully!');
    });


    test("setGenres tv test", async () => {
        const response = await request(app)
        .post('/sendGenres')
        .send({genres:[], medium: "tv"});
        expect(Array.isArray(response.body));
        response.body.forEach((entry) => expect.objectContaining(
            {name: expect.any(String),
            year:expect.any(String),
            description: expect.any(String),
            rating: expect.any(String), 
            posterImage: expect.any(String)}));
    });
    test("setGenres movie test", async () => {
        const response = await request(app)
        .post('/sendGenres')
        .send({genres:[], medium: "movie"});
        expect(Array.isArray(response.body));
        response.body.forEach((entry) => expect.objectContaining(
            {name: expect.any(String),
            year:expect.any(String),
            description: expect.any(String),
            rating: expect.any(String), 
            posterImage: expect.any(String)}));
    });
});

