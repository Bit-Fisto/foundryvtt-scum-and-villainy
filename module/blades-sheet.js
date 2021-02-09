/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */

export class BladesSheet extends ActorSheet {

  /* -------------------------------------------- */

  /** @override */
	activateListeners(html) {
    super.activateListeners(html);
    html.find(".item-add-popup").click(this._onItemAddClick.bind(this));
	html.find(".flag-add-popup").click(this._onFlagAddClick.bind(this));
	html.find(".update-sheet").click(this._onUpdateClick.bind(this));
	html.find(".update-system").click(this._onUpdateSysClick.bind(this));
	html.find(".update-heat").click(this._onUpdateHeatClick.bind(this));
	html.find(".update-wanted").click(this._onUpdateWantedClick.bind(this));
	html.find(".roll-die-attribute").click(this._onRollAttributeDieClick.bind(this));
	
    // This is a workaround until is being fixed in FoundryVTT.
    if ( this.options.submitOnChange ) {
      html.on("change", "textarea", this._onChangeInput.bind(this));  // Use delegated listener on the form
    }

    
  }

  /* -------------------------------------------- */

  async _onItemAddClick(event) {
    event.preventDefault();
	const item_type = $(event.currentTarget).data("itemType")
	const limiter = $(event.currentTarget).data("limiter")
    const distinct = $(event.currentTarget).data("distinct")
    let input_type = "checkbox";

    if (typeof distinct !== "undefined") {
      input_type = "radio";
    }

		
	let items = await BladesHelpers.getAllItemsByType(item_type, game);
	
    let html = `<div id="items-to-add">`;

	var nonclass_upgrades = ["Auxiliary", "Gear", "Training", "Upgrades", "Engines", "Comms", "Hull", "Weapons"];
	let actor_flags = this.actor.getFlag("scum-and-villainy", "ship") || [];
	var stun_weapons = 0;
	actor_flags.forEach(i => {
      if (i.data.installs.stun_inst == "1") {
        stun_weapons = 1;
      } else {
		stun_weapons = 0;
	  };
	});

	
    items.forEach(e => {
      let addition_price_load = ``;
      
      if (typeof e.data.load !== "undefined") {
        addition_price_load += `(${e.data.load})`
      } else if (typeof e.data.price !== "undefined") {
        addition_price_load += `(${e.data.price})`
      }
	  
	  
	  
	  if (e.type == "crew_upgrade") {
		  if (nonclass_upgrades.includes(e.data.class,0) || (e.data.class == this.actor.data.data.ship_class)) {
			html += `<input id="select-item-${e._id}" type="${input_type}" name="select_items" value="${e._id}">`;
			html += `<label class="flex-horizontal" for="select-item-${e._id}">`;
			html += `${game.i18n.localize(e.name)} ${addition_price_load} <i class="tooltip fas fa-question-circle"><span class="tooltiptext">${game.i18n.localize(e.data.description)}</span></i>`;
			html += `</label>`;
		  };
	  } else if (e.type == "crew_ability") {
		  if (e.data.class == this.actor.data.data.ship_class) {
			html += `<input id="select-item-${e._id}" type="${input_type}" name="select_items" value="${e._id}">`;
			html += `<label class="flex-horizontal" for="select-item-${e._id}">`;
			html += `${game.i18n.localize(e.name)} ${addition_price_load} <i class="tooltip fas fa-question-circle"><span class="tooltiptext">${game.i18n.localize(e.data.description)}</span></i>`;
			html += `</label>`;
		  };
	  } else if (e.type == "ability") {
		  if (e.data.class == this.actor.data.data.character_class) {
			html += `<input id="select-item-${e._id}" type="${input_type}" name="select_items" value="${e._id}">`;
			html += `<label class="flex-horizontal" for="select-item-${e._id}">`;
			html += `${game.i18n.localize(e.name)} ${addition_price_load} <i class="tooltip fas fa-question-circle"><span class="tooltiptext">${game.i18n.localize(e.data.description)}</span></i>`;
			html += `</label>`;
		  };
	  } else if (e.type == "item") {
		  if ((e.data.class == "Standard") || ((stun_weapons == 1) && (e.data.class == "Non-Lethal")) || (e.data.class == this.actor.data.data.character_class)) {
			html += `<input id="select-item-${e._id}" type="${input_type}" name="select_items" value="${e._id}">`;
			html += `<label class="flex-horizontal" for="select-item-${e._id}">`;
			html += `${game.i18n.localize(e.name)} ${addition_price_load} <i class="tooltip fas fa-question-circle"><span class="tooltiptext">${game.i18n.localize(e.data.description)}</span></i>`;
			html += `</label>`;
		  };
	  } else {
			html += `<input id="select-item-${e._id}" type="${input_type}" name="select_items" value="${e._id}">`;
			html += `<label class="flex-horizontal" for="select-item-${e._id}">`;
			html += `${game.i18n.localize(e.name)} ${addition_price_load} <i class="tooltip fas fa-question-circle"><span class="tooltiptext">${game.i18n.localize(e.data.description)}</span></i>`;
			html += `</label>`;
	  };
    });

    html += `</div>`;

    let options = {
      // width: "500"
    }
    
    let dialog = new Dialog({
      title: `${game.i18n.localize('Add')} ${item_type}`,
      content: html,
      buttons: {
        one: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize('Add'),
          callback: () => this.addItemsToSheet(item_type, $(document).find('#items-to-add'))
        },
        two: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize('Cancel'),
          callback: () => false
        }
      },
      default: "two"
    }, options);

    dialog.render(true);
  };

async _onFlagAddClick(event) {
    event.preventDefault();
	const item_type = $(event.currentTarget).data("itemType")
	const limiter = $(event.currentTarget).data("limiter")
    const distinct = $(event.currentTarget).data("distinct")
    let input_type = "checkbox";

    if (typeof distinct !== "undefined") {
      input_type = "radio";
    }

		
	let items = await BladesHelpers.getAllActorsByType(item_type, game);
	
    let html = `<div id="items-to-add">`;

    items.forEach(e => {
	  if (e.type === item_type) {
	  html += `<input id="select-item-${e._id}" type="${input_type}" name="select_items" value="${e._id}">`;
      html += `<label class="flex-horizontal" for="select-item-${e._id}">`;
      html += `${game.i18n.localize(e.name)} <i class="tooltip fas fa-question-circle"><span class="tooltiptext">${game.i18n.localize(e.data.designation)}</span></i>`;
      html += `</label>`;
	  }
    });

    html += `</div>`;

    let options = {
      // width: "500"
    }
    
    let dialog = new Dialog({
      title: `${game.i18n.localize('Add')} ${item_type}`,
      content: html,
      buttons: {
        one: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize('Add'),
          callback: () => this.addFlagsToSheet(item_type, $(document).find('#items-to-add'))
        },
        two: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize('Cancel'),
          callback: () => false
        }
      },
      default: "two"
    }, options);

    dialog.render(true);
  }

  
  /* -------------------------------------------- */

  async addItemsToSheet(item_type, el) {

    
	let items = await BladesHelpers.getAllItemsByType(item_type, game);
	let items_to_add = [];
    el.find("input:checked").each(function() {

	
		items_to_add.push(items.find(e => e._id === $(this).val()));
	
	  
    });
    this.actor.createEmbeddedEntity("OwnedItem", items_to_add);
  }
 
  async addFlagsToSheet(item_type, el) {

    
	let items = await BladesHelpers.getAllActorsByType(item_type, game);
	let items_to_add = [];
    el.find("input:checked").each(function() {

	
		items_to_add.push(items.find(e => e._id === $(this).val()));
	
	  
    });
    await this.actor.setFlag("scum-and-villainy", item_type, items_to_add);
  }



  /* -------------------------------------------- */

  /**
   * Roll an Attribute die.
   * @param {*} event 
   */
  async _onRollAttributeDieClick(event) {

    const attribute_name = $(event.currentTarget).data("rollAttribute");
    this.actor.rollAttributePopup(attribute_name);

  }

  /* -------------------------------------------- */
  async _onUpdateClick(event) {
	event.preventDefault();
	const item_type = $(event.currentTarget).data("itemType");
	const limiter = $(event.currentTarget).data("limiter");
    const system = "scum-and-villainy";
	
	//find all items of type in world	
	const world_items = await BladesHelpers.getAllItemsByType(item_type, game);
	//find all items of type attached to actor
	const curr_items = this.actor.data.items.filter(i => i.type === item_type);
	//find all items in world, but not attached to actor
	const add_items = world_items.filter(function(obj) {
		return !curr_items.some(function(obj2) {
			return obj._id == obj2._id;
		});
	});
	//find all items attached to actor, but not in world
	const d_items = curr_items.filter(function(obj) {
		return !world_items.some(function(obj2) {
			return obj._id == obj2._id;
		});
	});
	
	const delete_items = d_items.map( i => i._id );
	const flag_items = world_items.map( f => f.name );
	
	
	//add flags for all systems
	if ( item_type == "star_system" ) {
		
	flag_items.forEach( item => {
		if( !( this.actor.getFlag( system, "h" + item ) ) ){
			this.actor.setFlag( system, "h" + item, 0 );
		};
	});
	
	flag_items.forEach( item => {
		if( !( this.actor.getFlag( system, "w" + item ) ) ){
			this.actor.setFlag( system, "w" + item, 0 );
		};
	});
	};
	
	//delete all items attached to actor, but not in world
	await this.actor.deleteEmbeddedEntity("OwnedItem", delete_items);
	//attach any new items
	await this.actor.createEmbeddedEntity("OwnedItem", add_items);
  }
  
  /* -------------------------------------------- */
  async _onUpdateSysClick(event) {
	event.preventDefault();
	const tab = $(event.currentTarget).data("tab");
    	
		let sys_heat = await this.actor.getFlag("scum-and-villainy", tab + "_heat");
		
			console.log("success " + tab + " heat is " + sys_heat);
		
	
		let sys_wanted = await this.actor.getFlag("scum-and-villainy", tab + "_wanted");
		
			console.log("success " + tab + " wanted is " + sys_wanted);
		
		
	
	
	this.actor.data.data.heat.value = String(sys_heat);
	console.log("actor heat is " + this.actor.data.data.heat.value);
	this.actor.data.data.wanted.value = String(sys_wanted);
	console.log("actor wanted is " + this.actor.data.data.heat.value);
  }
  
 /* -------------------------------------------- */
  async _onUpdateHeatClick(event) {
	event.preventDefault();
	
	const update = $(event.currentTarget).data("update");
    console.log(update);
	let sys_heat = this.actor.data.data.heat.value;
	if (sys_heat == undefined) { sys_heat = 0 };
	
	await this.actor.setFlag("scum-and-villainy", update + "_heat", sys_heat);
	console.log("heat " + update + " " + sys_heat);
	
  }

 /* -------------------------------------------- */
  async _onUpdateWantedClick(event) {
	event.preventDefault();
	
	const update = $(event.currentTarget).data("update");
	const ivalue = $(event.currentTarget).data("ivalue");
    let sys_wanted = this.actor.data.data.wanted.value;
	console.log("actor wanted was " + sys_wanted);
		
	await this.actor.setFlag("scum-and-villainy", update + "_wanted", String(ivalue));
	console.log("wanted " + update + " " + ivalue);
	
  }
  
}