import sc.Task

class BootStrap {

    def init = { servletContext ->
        new Task(description: 'Create my Tasks Application').save()

        new Task(description: 'Create a Kickarse backend').save()
        
        new Task(description: 'Show people!').save()
    }
    def destroy = {
    }
}
