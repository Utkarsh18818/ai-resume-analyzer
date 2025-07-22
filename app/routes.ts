import { type RouteConfig, index } from "@react-router/dev/routes";
import {route} from "@react-router/dev/routes";

export default [index("routes/home.tsx"),
    route('/auth', 'routes/auth.tsx'),
    route('/upload', 'routes/upload.tsx'),
    route('/resume/:id', 'routes/resume.tsx'),
] satisfies RouteConfig;
