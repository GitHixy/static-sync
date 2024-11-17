const express = require('express');
const Static = require('../models/Static');
const User = require('../models/User');
const {updateData} = require('../utils/ffLogsV2');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();


router.post('/', protect, async (req, res) => {
    const { name, description } = req.body;

    try {
        const newStatic = new Static({
            owner: req.user._id,
            name,
            description,
            members: [],
            isComplete: false
        });

        const savedStatic = await newStatic.save();

        const user = await User.findById(req.user._id);
        user.statics.push({ staticId: savedStatic._id, name: savedStatic.name });
        await user.save();

        res.json(savedStatic);
    } catch (error) {
        console.error('Error creating static:', error);
        res.status(500).json({ message: 'Error creating static' });
    }
});


router.post('/:id/members', protect, async (req, res) => {
    const { playerId, name, lodestoneID, role, playerClass, data } = req.body; 
    
    try {
        
        const userStatic = await Static.findOne({ _id: req.params.id, owner: req.user._id });

        if (!userStatic) {
            return res.status(404).json({ message: 'Static not found' });
        }

        if (userStatic.members.length >= 8) {
            return res.status(400).json({ message: 'Static team is already full.' });
        }

        
        const existingMember = userStatic.members.find(
            (member) => member.playerId === playerId
        );
        if (existingMember) {
            return res.status(400).json({ message: 'Player is already in the static.' });
        }

        
        const newMember = {
            playerId: playerId,
            name: name,
            lodestoneID: lodestoneID,
            role: role,
            class: playerClass,
            data: data, 
        };

        userStatic.members.push(newMember);
        await userStatic.save();

        res.json(userStatic);
    } catch (error) {
        console.error('Error adding member to static:', error.message);
        res.status(500).json({ message: 'Error adding member to static' });
    }
});



router.get('/', protect, async (req, res) => {
    try {
        const userStatics = await Static.find({ owner: req.user._id });

        const staticsWithValidation = userStatics.map(staticItem => ({
            ...staticItem.toObject(),
            isValidComposition: staticItem.validateComposition(),
        }));

        res.json(staticsWithValidation);
    } catch (error) {
        console.error('Error fetching statics:', error.message);
        res.status(500).json({ message: 'Error fetching statics' });
    }
});

router.get('/:id', protect, async (req, res) => {
    try {
        const staticItem = await Static.findOne({ _id: req.params.id, owner: req.user._id });

        if (!staticItem) {
            return res.status(404).json({ message: 'Static not found' });
        }

        const staticWithValidation = {
            ...staticItem.toObject(),
            isValidComposition: staticItem.validateComposition(),
        };

        res.json(staticWithValidation);
    } catch (error) {
        console.error('Error fetching static:', error.message);
        res.status(500).json({ message: 'Error fetching static' });
    }
});

router.put("/:staticId/update-members", protect, async (req, res) => {
    const { staticId } = req.params || req.body;
  
    try {
      
      const staticData = await Static.findById(staticId);
    
      if (!staticData) {
        return res.status(404).json({ message: "Static not found" });
      }
  
      
      const updatedMembers = await Promise.all(
        staticData.members.map(async (member) => {
          try {
            
            const characterData = await updateData(parseInt(member.playerId));
            const character = characterData.data.characterData?.character; 
            
  
            if (!character) {
              console.warn(
                `No character data found for member ID: ${member.playerId}`
              );
              return member; 
            }
  
            
            const updatedMember = {
              ...member.toObject(), 
              data: {
                id: character.id,
                name: character.name,
                lodestoneID: character.lodestoneID,
                guildRank: character.guildRank,
                guilds: character.guilds,
                Raids: {
                  bestHPSRankings: character.bestHPSRankingsRaids,
                  bestDPSRankings: character.bestDPSRankingsRaids,
                },
                Trials: {
                  bestHPSRankingsEX1: character.bestHPSRankingsEX1,
                  bestDPSRankingsEX1: character.bestDPSRankingsEX1,
                  bestHPSRankingsEX2: character.bestHPSRankingsEX2,
                  bestDPSRankingsEX2: character.bestDPSRankingsEX2,
                  bestHPSRankingsEX3: character.bestHPSRankingsEX3,
                  bestDPSRankingsEX3: character.bestDPSRankingsEX3,
                },
              },
            };
  
            return updatedMember;
          } catch (error) {
            console.error(
              `Error fetching data for member ID: ${member.playerId}`,
              error.message
            );
            return member; 
          }
        })
      );
  
      
      staticData.members = updatedMembers;
  
      
      await staticData.save();
  
      res.status(200).json({ message: "Members updated successfully", staticData });
    } catch (error) {
      console.error("Error updating static members:", error.message);
      res.status(500).json({ message: "Failed to update static members" });
    }
  });

router.delete('/:id', protect, async (req, res) => {
    try {

        const userStatic = await Static.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

        if (!userStatic) {
            return res.status(404).json({ message: 'Static not found' });
        }


        const user = await User.findById(req.user._id);
        if (user) {
            user.statics = user.statics.filter(staticEntry => !staticEntry.staticId.equals(req.params.id));
            await user.save();
        }

        res.json({ message: 'Static successfully deleted' });
    } catch (error) {
        console.error('Error deleting static:', error.message);
        res.status(500).json({ message: 'Error deleting static' });
    }
});

module.exports = router;
