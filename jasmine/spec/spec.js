/* spec.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against application.
 */

 describe("Engine function", function() {
    var engine;
    beforeEach(function() {
        engine = new Engine();
    });

  it("addEntityToScreen works", function() { 
    expect(engine.screen.entities.length).toBe(0);
    var entity = new Entity(0, 0);
    engine.addEntityToScreen(entity);
    expect(engine.screen.entities.length).toBe(1);
    expect(engine.screen.entities[0]).toBe(entity);
  });

  it("addSubscribtion works", function() { 
    expect(engine.screen.subscribtions.length).toBe(0);
    var entity = new Entity(0, 0);
    var sub = new Subscribtion(entity, [Enemy], function() {});
    engine.addSubscribtion(sub);
    expect(engine.screen.subscribtions.length).toBe(1);
    expect(engine.screen.subscribtions[0]).toBe(sub);
  });

  it("addUserInputSubscribtion works", function() { 
    expect(engine.screen.userInputSubscribtions.length).toBe(0);
    var entity = new Entity(0, 0);
    var sub = new UserInputSubscribtion("up", entity, function() {});
    engine.addUserInputSubscribtion(sub);
    expect(engine.screen.userInputSubscribtions.length).toBe(1);
    expect(engine.screen.userInputSubscribtions[0]).toBe(sub);
  });

  it("addTimeSubscribtion works", function() { 
    expect(engine.screen.timeSubscribtions.length).toBe(0);
    var entity = new Entity(0, 0);
    var sub = new UserInputSubscribtion(entity, 1, function() {});
    engine.addTimeSubscribtion(sub);
    expect(engine.screen.timeSubscribtions.length).toBe(1);
    expect(engine.screen.timeSubscribtions[0]).toBe(sub);
  });

  it("emptyScreen works", function() {

  });
});
