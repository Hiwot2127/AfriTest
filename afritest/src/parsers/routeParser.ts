export class RouteParser {
    private fileContent: string;

    constructor(fileContent: string) {
        this.fileContent = fileContent;
    }

    public parseRoutes(): { path: string, method: string }[] {
        const routes: { path: string, method: string }[] = [];
        const routeRegex = /app\.(get|post|put|delete)\(['"`]([^'"`]+)['"`]/g;
        let match;
        while ((match = routeRegex.exec(this.fileContent)) !== null) {
            routes.push({ method: match[1], path: match[2] });
        }
        return routes;
    }
}