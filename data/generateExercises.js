const baseExercises = require("./baseExercises");

const equipments = ["barbell","dumbbell","machine","cable","band","bodyweight"];
const grips = ["standard","wide","close","neutral","underhand"];
const angles = ["flat","incline","decline","overhead"];
const executions = ["bilateral","unilateral"];

const generated = [];

baseExercises.forEach(function(base) {
  equipments.forEach(function(eq) {
    grips.forEach(function(grip) {
      angles.forEach(function(angle) {
        executions.forEach(function(exec) {

          const id =
            base.id + "_" + eq + "_" + grip + "_" + angle + "_" + exec;

          const name =
            (angle !== "flat" ? angle + " " : "") +
            eq + " " +
            base.name +
            " (" + grip + ", " + exec + ")";

          generated.push({
            id: id,
            name: name,
            baseId: base.id,
            primary: base.primary,
            secondary: base.secondary,
            equipment: eq,
            grip: grip,
            angle: angle,
            execution: exec
          });

        });
      });
    });
  });
});

console.log("module.exports = " + JSON.stringify(generated, null, 2));