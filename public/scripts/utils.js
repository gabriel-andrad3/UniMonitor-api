function sortById(objects) {
    objects = objects.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0);
}
