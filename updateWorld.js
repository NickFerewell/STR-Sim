function updateWorld() {
    

    bodies.forEach(body => {
        body.update();
    });
}
