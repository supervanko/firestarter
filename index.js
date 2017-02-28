const pm = angular.module('project-manager', []);

pm.directive('autoFocus', () => ({
    link(scope, el) {
        setTimeout(() => {
            el[0].focus();
        }, 100);
    }
}));

class Projects {
    constructor() {
        this.projects = [{
            name: 'New Project',
            tasks: []
        }];
    }

    addProject() {
        this.projects.push({
            name: 'New Project',
            tasks: []
        });
    }

    onRemove(project) {
        const index = this.projects.findIndex((i) => i === project);
        this.projects.splice(index, 1);
    }
}

pm.component('projects', {
    controller: Projects,
    template: `
        <div ng-repeat="project in $ctrl.projects">
            <project project="project" on-remove="$ctrl.onRemove(project)" class="project" ></project>
            <br><br>
        </div>
  		
        <span ng-click="$ctrl.addProject()" class="addBtn btn" >
            New Project
        </span>
	`
});

class Project {
    constructor() {
        this.editNameMode = false;
        this.newTaskName = '';
    }

    onEnterPress(event, newName) {
        const enterKey = 13;
        if (event.keyCode === enterKey) {
            this.turnOffEditName(newName);
        }
    }

    turnOnEditName() {
        this.editNameMode = true;
    }

    turnOffEditName(newName) {
        this.editNameMode = false;
        console.log(newName);
    }

    addTask(name) {
        if (!name) {
            alert("You must write something!");
            return;
        }

        this.project.tasks.push({
            name: this.newTaskName,
            completed: false
        });
        this.newTaskName = '';
    }

    removeTask(task) {
        const index = this.project.tasks.findIndex((i) => i === task);
        this.project.tasks.splice(index, 1);
    }

    toggleTaskCompleteness(task) {
        task.completed = !task.completed;
    }
}

pm.component('project', {
    bindings: {
      onRemove: '&',
      project: '='
    },
    controller: Project,
    template: `
        <div id="myDIV" class="header">
            <h2 style="margin:5px">
                <input type="text"
                       ng-if="$ctrl.editNameMode"
                       ng-model="$ctrl.project.name"
                       auto-focus
                       ng-blur="$ctrl.turnOffEditName($ctrl.project.name)"
                       ng-keypress="$ctrl.onEnterPress($event, $ctrl.project.name)"
                       class="edit-name"/>
               
               <span ng-if="!$ctrl.editNameMode"> {{ $ctrl.project.name }} </span>
               
               <span class="pull-right">
                   <button ng-click="$ctrl.onRemove({project: $ctrl.project})">Remove</button>
                   <button ng-click="$ctrl.turnOnEditName()">Edit</button>
               </span>
            </h2>
            
            <input type="text" ng-model="$ctrl.newTaskName" placeholder="Title...">
            <span ng-click="$ctrl.addTask($ctrl.newTaskName)" class="addBtn">Add task</span>
            
        </div>
        
        <ul id="myUL">
            <li ng-repeat="task in $ctrl.project.tasks" 
                ng-class="{checked: task.completed}"
                ng-click="$ctrl.toggleTaskCompleteness(task)">
                {{ task.name }}
                <span class="close" ng-click="$ctrl.removeTask(task)">\u00D7</span>  
            </li>
        </ul>
    `
});