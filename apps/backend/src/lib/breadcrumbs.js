function getBreadcrumbs(folder) {
    if (!folder) {
        return [];
    }
    if (!folder.parent) {
        return [{name: folder.name, folderId: folder.id}];
    }
    const breadcrumb = getBreadcrumbs(folder.parent);
    breadcrumb.push({name: folder.name, folderId: folder.id});
    return breadcrumb;
}

module.exports = getBreadcrumbs;