 var dosbox = new Dosbox({
        id: "dosbox",
        onload: function (dosbox) {   dosbox.run("https://cdn.rawgit.com/darrengruber/docker-em-dosbox-doom/afad47b2/doom_shareware/doom19s_deiced.zip", "./DOOM.EXE");
        },
        onrun: function (dosbox, app) {
          console.log("App '" + app + "' is runned");
        }
      });
