/*
 *   Copyright (c) 2024 Malte Hering
 *   All rights reserved.

 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at

 *   http://www.apache.org/licenses/LICENSE-2.0

 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

const path = require("path");
const fs = require("fs");
const { exec, execSync } = require("child_process");


let projectsFolderPath = path.join(__dirname, "projects");
let projects = fs.readdirSync(projectsFolderPath, { withFileTypes: true });
projects = projects.filter((project) => {
    return project.isDirectory();
});

let args = process.argv;
args = args.filter((arg, index) => {
    return index > 1;
});

class Project {
    constructor(command, projectpath) {
        this.command = command;
        this.path = projectpath
        this.process = null;

        this.stdout = "";
        this.stderr = "";
    }

    start() {
        this.stdout = "";
        this.stderr = "";
        this.process = exec(this.command, {
            cwd: this.path,
        });
        console.log(this.path);
        this.process.stdout.on("data", this.onStdioData.bind(this));
        this.process.stderr.on("data", this.onStderrData.bind(this));
        this.process.on("close", this.onEnd.bind(this));

    }

    onStdioData(data) {
        this.stdout += data.toString();
    }
    onStderrData(data) {
        this.stderr += data.toString();
    }

    onEnd(code) {
        console.log(this.stdio);
        console.log(this.stderr)
        console.log(code)
    }

}

projects = projects.map((project) => {
    return new Project(args.join(" "), path.join(projectsFolderPath, project.name))
});
projects.forEach((project) => {
    project.start();
});


//console.log(projects)



