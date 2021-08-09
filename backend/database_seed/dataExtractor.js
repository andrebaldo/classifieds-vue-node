let Makes = [];
$("#model option").each(function(index, model) {
  localMake.models.push({
    MakeId: localMake.MakeId,
    ModeId: $(model).val(),
    ModelName: $(model).text()
  });
  if ($("#model option").length == index + 1) {
    resolve(m);
  }
});

//$('#model option:first').prop("select", true);

let processMake = function(Make) {
  return new Promise(function(resolve) {
    let m = { MakeId: $(Make).val(), Name: $(Make).text() };

    setTimeout(
      localMake => {
        console.log("setTimeout((localMake))" + localMake.MakeId);
        let models = [];
        $("#model option").each(function(index, model) {
          models.push({
            MakeId: $("#make").val(),
            ModeId: $(model).val(),
            ModelName: $(model).text()
          });
          if ($("#model option").length == index + 1) {
            resolve(m);
          }
        });
        Makes.push(localMake);
      },
      5000,
      m
    );
  });
};

$("#make option").each(function(index, make) {
  console.log("$('#make option').each():" + make.text);
  if (index === 0) {
    $(make).prop("selected", true);
  }
  setTimeout(
    lmake => {
      processMake(lmake).then(function(processedMake) {
        $("#make").click();
        $(make).click();
      });
    },
    5000 * index + 1,
    make
  );
});

JSON.stringify(Makes);
