use core::starknet::{ContractAddress};
use core::starknet::storage::{Vec, VecTrait, MutableVecTrait, Map};

// Define an interface `ICounter` for interacting with the contract
#[starknet::interface]
pub trait IPollContract<TContractState> {
    // Poll management functions
    fn create_poll(
        ref self: TContractState, text: ByteArray, options: Array<ByteArray>,
    ); // Creates a new poll with a question and options
    //     fn vote(
//     ref self: TContractState,
//     poll_id: u64,
//     option_index: u64
// ); // Allows a user to vote on a poll option

    // fn get_live_results(
//     self: @TContractState,
//     poll_id: u64
// ) -> (ByteArray, Array<ByteArray>, Array<u64>, u64); // Gets live poll results

    // fn get_user_vote(
//     self: @TContractState,
//     poll_id: u64,
//     user: ContractAddress
// ) -> Option<u64>; // Gets the user's vote for a specific poll

    // fn get_poll_count(self: @TContractState) -> u64; // Gets the total number of polls

    // // Function to retrieve poll options
// fn get_poll_options(self: @TContractState, poll_id: u64) -> Array<ByteArray>; // Gets the
// options for a specific poll

    // // Function to get the total votes for a poll
// fn get_poll_total_votes(self: @TContractState, poll_id: u64) -> u64; // Gets the total votes
// for a poll
}


#[starknet::contract]
mod PollContract {
    use super::IPollContract;
    use core::starknet::{ContractAddress, get_caller_address};
    use core::starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, Vec, VecTrait, MutableVecTrait, Map,
        StoragePathEntry,
    };

    // Define the storage structure for the contract
    #[storage]
    pub struct Storage {
        poll_texts: Vec<ByteArray>, // Holds poll questions
        poll_options: Map<u64, Vec<ByteArray> // Maps poll ID to its options
        >,
        poll_votes: Map<u64, Map<u64, u64> // Maps poll ID and option index to vote count
        >,
        poll_user_votes: Map<
            u64, Map<ContractAddress, u64> // Maps poll ID and user address to their vote
        >,
        poll_total_votes: Map<u64, u64 // Maps poll ID to total votes
        >,
    }

    // Constructor to initialize the contract's state
    #[constructor]
    fn constructor(ref self: ContractState) { // Initialization logic if needed
    }

    // Events emitted by the contract
    // #[event]
    // #[derive(Drop, starknet::Event)]
    // pub enum Event {
    //     PollCreated: PollCreated, // Emitted when a poll is created
    //     Voted: Voted, // Emitted when a user votes
    // }

    // Event structure for PollCreated
    // #[derive(Drop, starknet::Event)]
    // pub struct PollCreated {
    //     pub poll_id: u64,
    //     pub text: ByteArray,
    //     pub options: Vec<ByteArray>,
    // }

    // Event structure for Voted
    // #[derive(Drop, starknet::Event)]
    // pub struct Voted {
    //     pub poll_id: u64,
    //     pub option_index: u64,
    //     pub voter: ContractAddress,
    // }

    // Implementation of the `IPollContract` interface
    #[abi(embed_v0)]
    impl PollContractImpl of IPollContract<ContractState> {
        // Creates a new poll with a question and options
        fn create_poll(ref self: ContractState, text: ByteArray, options: Array<ByteArray>) {
            assert!(options.len() > 1, "A poll must have at least 2 options.");

            let poll_id = self.poll_texts.len() + 1;
            self.poll_texts.append().write(text);

            for i in 0..options.len() {
                self.poll_options.entry(poll_id).append().write(options.at(i).clone());
                self.poll_votes.entry(poll_id).entry(i.into() + 1).write(0);
                self.poll_user_votes.entry(poll_id).entry(get_caller_address()).write(i.into() + 1);
            };

            self.poll_total_votes.entry(poll_id).write(0);
            // self.poll_options.entry(poll_id).write(options.clone());
        // self.poll_user_votes.entry(poll_id).write(Map::<ContractAddress, u64>::new());
        // self.emit(PollCreated {
        //     poll_id,
        //     text,
        //     options,
        // });
        }
        // Allows a user to vote on a specific poll
    // fn vote(ref self: ContractState, poll_id: u64, option_index: u64) {
    //     assert!(poll_id > 0 && poll_id <= self.poll_texts.len(), "Poll does not exist.");
    //     let user = get_caller_address();
    //     assert!(self.poll_user_votes.entry(poll_id).read().get(get_caller_address()).is_none(),
    //     "You have already voted on this poll.");

        //         let options = self.poll_options.entry(poll_id).read();
    //     assert!(option_index > 0 && option_index <= options.len() as u64, "Invalid option
    //     index.");

        //         let mut votes_map = self.poll_votes.entry(poll_id).read();
    //     let mut total_votes = self.poll_total_votes.entry(poll_id).read();

        //         // Increment vote count for the selected option
    //     votes_map.entry(option_index).write(votes_map.entry(option_index).read() + 1);
    //     self.poll_user_votes.entry(poll_id).write(Map::<ContractAddress, u64>::new());
    //     self.poll_user_votes.entry(poll_id).read().insert(user, option_index);

        //         // Increment the total votes for the poll
    //     total_votes.write(total_votes.read() + 1);

        //         self.emit(Voted {
    //         poll_id,
    //         option_index,
    //         voter: user,
    //     });
    // }

        // // Gets live results of a poll
    // fn get_live_results(
    //     self: @ContractState,
    //     poll_id: u64
    // ) -> (ByteArray, Vec<ByteArray>, Vec<u64>, u64) {
    //     assert!(poll_id > 0 && poll_id <= self.poll_texts.len(), "Poll does not exist.");

        //     let text = self.poll_texts.at(poll_id - 1).read();
    //     let options = self.poll_options.entry(poll_id).read();
    //     let total_votes = self.poll_total_votes.entry(poll_id).read();

        //     let mut vote_counts = Vec::<u64>::new();
    //     let votes_map = self.poll_votes.entry(poll_id).read();
    //     for i in 1..=options.len() {
    //         vote_counts.append(votes_map.entry(i as u64).read());
    //     }

        //     (text, options, vote_counts, total_votes)
    // }

        // // Gets the vote of a specific user for a given poll
    // fn get_user_vote(
    //     self: @ContractState,
    //     poll_id: u64,
    //     user: ContractAddress
    // ) -> Option<u64> {
    //     assert!(poll_id > 0 && poll_id <= self.poll_texts.len(), "Poll does not exist.");
    //     let user_vote = self.poll_user_votes.entry(poll_id).read().get(&user);
    //     user_vote
    // }

        // // Gets the total number of polls created
    // fn get_poll_count(self: @ContractState) -> u64 {
    //     self.poll_texts.len() as u64
    // }

        // // Gets the options for a specific poll
    // fn get_poll_options(self: @ContractState, poll_id: u64) -> Vec<ByteArray> {
    //     assert!(poll_id > 0 && poll_id <= self.poll_texts.len(), "Poll does not exist.");
    //     self.poll_options.entry(poll_id).read()
    // }

        // // Gets the total votes for a specific poll
    // fn get_poll_total_votes(self: @ContractState, poll_id: u64) -> u64 {
    //     assert!(poll_id > 0 && poll_id <= self.poll_texts.len(), "Poll does not exist.");
    //     self.poll_total_votes.entry(poll_id).read()
    // }
    }
}
